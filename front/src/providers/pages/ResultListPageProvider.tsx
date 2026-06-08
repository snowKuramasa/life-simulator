import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useMemo, useRef, useState } from "react";

import {
  useCommutesQuery,
  useCreateCommuteMutation,
  useUpdateCommuteMutation,
} from "@/hooks/commutes/useCommuteQueries";
import { useResidencesQuery } from "@/hooks/residences/useResidenceQueries";
import { useWorkplacesQuery } from "@/hooks/workplaces/useWorkplaceQueries";
import { calculateMonthlySurplus } from "@/lib/calculateMonthlySurplus";
import {
  type CommuteSaveStatus,
  type HouseholdSize,
  ResultListPageContext,
  type ResultListItem,
  type ResultSortKey,
  type ResultStatus,
} from "@/providers/pages/ResultListPageContext";

type ResultListPageProviderProps = {
  children: ReactNode;
};

function getResultStatus(monthlySurplus: number): ResultStatus {
  if (monthlySurplus >= 0) {
    return "余裕あり";
  }

  if (monthlySurplus >= -30_000) {
    return "普通";
  }

  return "やや厳しい";
}

export function ResultListPageProvider({ children }: ResultListPageProviderProps) {
  const queryClient = useQueryClient();
  const workplacesQuery = useWorkplacesQuery();
  const residencesQuery = useResidencesQuery();
  const commutesQuery = useCommutesQuery();
  const createCommute = useCreateCommuteMutation();
  const updateCommute = useUpdateCommuteMutation();
  const [sortKey, setSortKey] = useState<ResultSortKey>("monthlySurplus");
  const [householdSize, setHouseholdSize] = useState<HouseholdSize>("single");
  const [commuteSaveStatuses, setCommuteSaveStatuses] = useState<
    Record<string, CommuteSaveStatus | undefined>
  >({});
  const successTimerIdsRef = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});

  const results = useMemo<ResultListItem[]>(() => {
    const workplaces = workplacesQuery.data?.workplaces ?? [];
    const residences = residencesQuery.data?.residences ?? [];
    const commutes = commutesQuery.data?.commutes ?? [];

    const nextResults = workplaces.flatMap((workplace) =>
      residences.map((residence) => {
        const commute =
          commutes.find(
            (commuteItem) =>
              commuteItem.workplace_id === workplace.id && commuteItem.residence_id === residence.id,
          ) ?? null;
        const monthlySurplus = calculateMonthlySurplus({
          monthlyIncome: workplace.salary,
          rent: residence.rent,
        });

        return {
          id: `${workplace.id}-${residence.id}`,
          workplace,
          residence,
          commute,
          monthlySurplus,
          status: getResultStatus(monthlySurplus),
        };
      }),
    );

    if (sortKey === "commuteMinutes") {
      return nextResults.sort((firstResult, secondResult) => {
        const firstMinutes = firstResult.commute?.commute_minutes ?? Number.POSITIVE_INFINITY;
        const secondMinutes = secondResult.commute?.commute_minutes ?? Number.POSITIVE_INFINITY;

        return firstMinutes - secondMinutes;
      });
    }

    return nextResults.sort(
      (firstResult, secondResult) => secondResult.monthlySurplus - firstResult.monthlySurplus,
    );
  }, [
    commutesQuery.data?.commutes,
    residencesQuery.data?.residences,
    sortKey,
    workplacesQuery.data?.workplaces,
  ]);

  const isLoading = workplacesQuery.isLoading || residencesQuery.isLoading || commutesQuery.isLoading;
  const errorMessage =
    workplacesQuery.isError || residencesQuery.isError || commutesQuery.isError
      ? "結果一覧の読み込みに失敗しました。もう一度お試しください。"
      : null;

  async function saveCommuteMinutes(result: ResultListItem, commuteMinutes: number) {
    const successTimerId = successTimerIdsRef.current[result.id];

    if (successTimerId) {
      clearTimeout(successTimerId);
    }

    setCommuteSaveStatuses((statuses) => ({ ...statuses, [result.id]: "saving" }));

    try {
      if (result.commute) {
        await updateCommute.mutateAsync({
          id: result.commute.id,
          workplace_id: result.workplace.id,
          residence_id: result.residence.id,
          commute_minutes: commuteMinutes,
        });
      } else {
        await createCommute.mutateAsync({
          workplace_id: result.workplace.id,
          residence_id: result.residence.id,
          commute_minutes: commuteMinutes,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["commutes"] });
      setCommuteSaveStatuses((statuses) => ({ ...statuses, [result.id]: "success" }));
      successTimerIdsRef.current[result.id] = setTimeout(() => {
        setCommuteSaveStatuses((statuses) => ({ ...statuses, [result.id]: "idle" }));
        successTimerIdsRef.current[result.id] = undefined;
      }, 2500);

      return true;
    } catch {
      setCommuteSaveStatuses((statuses) => ({ ...statuses, [result.id]: "error" }));

      return false;
    }
  }

  return (
    <ResultListPageContext.Provider
      value={{
        results,
        sortKey,
        setSortKey,
        householdSize,
        setHouseholdSize,
        commuteSaveStatuses,
        saveCommuteMinutes,
        isLoading,
        errorMessage,
      }}
    >
      {children}
    </ResultListPageContext.Provider>
  );
}
