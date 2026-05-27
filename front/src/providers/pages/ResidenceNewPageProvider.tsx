import { type FormEvent, type ReactNode, useState } from "react";
import { useSearchParams } from "react-router";

import { useCreateResidenceMutation } from "@/hooks/residences/useResidenceQueries";
import { ResidenceNewPageContext } from "@/providers/pages/ResidenceNewPageContext";

type ResidenceNewPageProviderProps = {
  children: ReactNode;
};

export function ResidenceNewPageProvider({ children }: ResidenceNewPageProviderProps) {
  const [searchParams] = useSearchParams();
  const createResidence = useCreateResidenceMutation();
  const [name, setName] = useState("");
  const [rent, setRent] = useState("");
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
      await createResidence.mutateAsync({
        name,
        rent: Number(rent),
        prefecture,
        city,
      });
      setMessage(isInitialFlow ? "住居を登録しました。結果を確認できます。" : "住居を保存しました。");
    } catch {
      setErrorMessage("住居の保存に失敗しました。入力内容を確認してもう一度お試しください。");
    }
  }

  return (
    <ResidenceNewPageContext.Provider
      value={{
        name,
        setName,
        rent,
        setRent,
        prefecture,
        setPrefecture,
        city,
        setCity,
        isInitialFlow,
        isSubmitting: createResidence.isPending,
        message,
        errorMessage,
        handleSubmit,
      }}
    >
      {children}
    </ResidenceNewPageContext.Provider>
  );
}
