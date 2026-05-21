import { type FormEvent, type ReactNode, useState } from "react";
import { useParams } from "react-router";

import { useUpdateWorkplaceMutation, useWorkplaceQuery } from "@/hooks/workplaces/useWorkplaceQueries";
import { WorkplaceEditPageContext } from "@/providers/pages/WorkplaceEditPageContext";
import type { Workplace } from "@/types";

type WorkplaceEditPageProviderProps = {
  children: ReactNode;
};

type WorkplaceEditFormStateProviderProps = {
  children: ReactNode;
  workplace: Workplace;
};

const noop = () => {};

async function noopSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function WorkplaceEditFormStateProvider({ children, workplace }: WorkplaceEditFormStateProviderProps) {
  const updateWorkplace = useUpdateWorkplaceMutation();
  const [name, setName] = useState(workplace.name);
  const [salary, setSalary] = useState(String(workplace.salary));
  const [prefecture, setPrefecture] = useState(workplace.prefecture);
  const [city, setCity] = useState(workplace.city);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      await updateWorkplace.mutateAsync({
        id: workplace.id,
        name,
        salary: Number(salary),
        prefecture,
        city,
      });
      setMessage("勤務先を保存しました。");
    } catch {
      setErrorMessage("勤務先の保存に失敗しました。入力内容を確認してもう一度お試しください。");
    }
  }

  return (
    <WorkplaceEditPageContext.Provider
      value={{
        name,
        setName,
        salary,
        setSalary,
        prefecture,
        setPrefecture,
        city,
        setCity,
        isSubmitting: updateWorkplace.isPending,
        message,
        errorMessage,
        handleSubmit,
      }}
    >
      {children}
    </WorkplaceEditPageContext.Provider>
  );
}

export function WorkplaceEditPageProvider({ children }: WorkplaceEditPageProviderProps) {
  const params = useParams();
  const workplaceId = params.id ? Number(params.id) : null;
  const normalizedWorkplaceId = workplaceId && Number.isInteger(workplaceId) ? workplaceId : null;
  const workplaceQuery = useWorkplaceQuery(normalizedWorkplaceId);
  const workplace = workplaceQuery.data?.workplace;

  if (workplace) {
    return (
      <WorkplaceEditFormStateProvider key={workplace.id} workplace={workplace}>
        {children}
      </WorkplaceEditFormStateProvider>
    );
  }

  const loadingMessage = workplaceQuery.isLoading ? "勤務先を読み込んでいます。" : null;
  const loadErrorMessage =
    !normalizedWorkplaceId || workplaceQuery.isError
      ? "勤務先の読み込みに失敗しました。もう一度お試しください。"
      : null;

  return (
    <WorkplaceEditPageContext.Provider
      value={{
        name: "",
        setName: noop,
        salary: "",
        setSalary: noop,
        prefecture: "",
        setPrefecture: noop,
        city: "",
        setCity: noop,
        isSubmitting: workplaceQuery.isLoading,
        message: loadingMessage,
        errorMessage: loadErrorMessage,
        handleSubmit: noopSubmit,
      }}
    >
      {children}
    </WorkplaceEditPageContext.Provider>
  );
}
