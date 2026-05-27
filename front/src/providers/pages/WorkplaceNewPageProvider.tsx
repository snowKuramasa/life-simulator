import { type FormEvent, type ReactNode, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useCreateWorkplaceMutation } from "@/hooks/workplaces/useWorkplaceQueries";
import { WorkplaceNewPageContext } from "@/providers/pages/WorkplaceNewPageContext";

type WorkplaceNewPageProviderProps = {
  children: ReactNode;
};

export function WorkplaceNewPageProvider({ children }: WorkplaceNewPageProviderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createWorkplace = useCreateWorkplaceMutation();
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isInitialFlow = searchParams.get("flow") === "initial";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      await createWorkplace.mutateAsync({
        name,
        salary: Number(salary),
        prefecture,
        city,
      });
      if (isInitialFlow) {
        navigate("/residences/new?flow=initial");
        return;
      }

      setMessage("勤務先を保存しました。");
    } catch {
      setErrorMessage("勤務先の保存に失敗しました。入力内容を確認してもう一度お試しください。");
    }
  }

  return (
    <WorkplaceNewPageContext.Provider
      value={{
        name,
        setName,
        salary,
        setSalary,
        prefecture,
        setPrefecture,
        city,
        setCity,
        isInitialFlow,
        isSubmitting: createWorkplace.isPending,
        message,
        errorMessage,
        handleSubmit,
      }}
    >
      {children}
    </WorkplaceNewPageContext.Provider>
  );
}
