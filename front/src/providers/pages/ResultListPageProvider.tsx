import { type ReactNode, useMemo, useState } from "react";

import { useCommutesQuery } from "@/hooks/commutes/useCommuteQueries";
import { useResidencesQuery } from "@/hooks/residences/useResidenceQueries";
import { useWorkplacesQuery } from "@/hooks/workplaces/useWorkplaceQueries";
import { calculateDisposableIncome } from "@/lib/calculateDisposableIncome";
import {
  ResultListPageContext,
  type ResultListItem,
  type ResultSortKey,
  type ResultStatus,
} from "@/providers/pages/ResultListPageContext";

type ResultListPageProviderProps = {
  children: ReactNode;
};

function getResultStatus(disposableIncome: number): ResultStatus {
  if (disposableIncome >= 100_000) {
    return "余裕あり";
  }

  if (disposableIncome >= 50_000) {
    return "普通";
  }

  return "やや厳しい";
}

export function ResultListPageProvider({ children }: ResultListPageProviderProps) {
  const workplacesQuery = useWorkplacesQuery();
  const residencesQuery = useResidencesQuery();
  const commutesQuery = useCommutesQuery();
  const [sortKey, setSortKey] = useState<ResultSortKey>("disposableIncome");

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
        const disposableIncome = calculateDisposableIncome({
          monthlyIncome: workplace.salary,
          fixedCosts: residence.rent,
        });

        return {
          id: `${workplace.id}-${residence.id}`,
          workplace,
          residence,
          commute,
          disposableIncome,
          status: getResultStatus(disposableIncome),
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
      (firstResult, secondResult) => secondResult.disposableIncome - firstResult.disposableIncome,
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

  return (
    <ResultListPageContext.Provider value={{ results, sortKey, setSortKey, isLoading, errorMessage }}>
      {children}
    </ResultListPageContext.Provider>
  );
}
