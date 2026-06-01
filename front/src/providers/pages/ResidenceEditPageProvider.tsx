import { type FormEvent, type ReactNode, useState } from "react";
import { useParams } from "react-router";

import { useResidenceQuery, useUpdateResidenceMutation } from "@/hooks/residences/useResidenceQueries";
import { ResidenceEditPageContext } from "@/providers/pages/ResidenceEditPageContext";
import type { Residence } from "@/types";

type ResidenceEditPageProviderProps = {
  children: ReactNode;
};

type ResidenceEditFormStateProviderProps = {
  children: ReactNode;
  residence: Residence;
};

const noop = () => {};

async function noopSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function ResidenceEditFormStateProvider({ children, residence }: ResidenceEditFormStateProviderProps) {
  const updateResidence = useUpdateResidenceMutation();
  const [name, setName] = useState(residence.name);
  const [rent, setRent] = useState(String(residence.rent));
  const [prefecture, setPrefecture] = useState(residence.prefecture);
  const [city, setCity] = useState(residence.city);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      await updateResidence.mutateAsync({
        id: residence.id,
        name,
        rent: Number(rent),
        prefecture,
        city,
      });
      setMessage("住居を保存しました。");
    } catch {
      setErrorMessage("住居の保存に失敗しました。入力内容を確認してもう一度お試しください。");
    }
  }

  return (
    <ResidenceEditPageContext.Provider
      value={{
        name,
        setName,
        rent,
        setRent,
        prefecture,
        setPrefecture,
        city,
        setCity,
        isSubmitting: updateResidence.isPending,
        message,
        errorMessage,
        handleSubmit,
      }}
    >
      {children}
    </ResidenceEditPageContext.Provider>
  );
}

export function ResidenceEditPageProvider({ children }: ResidenceEditPageProviderProps) {
  const params = useParams();
  const residenceId = params.id ? Number(params.id) : null;
  const normalizedResidenceId = residenceId && Number.isInteger(residenceId) ? residenceId : null;
  const residenceQuery = useResidenceQuery(normalizedResidenceId);
  const residence = residenceQuery.data?.residence;

  if (residence) {
    return (
      <ResidenceEditFormStateProvider key={residence.id} residence={residence}>
        {children}
      </ResidenceEditFormStateProvider>
    );
  }

  const loadingMessage = residenceQuery.isLoading ? "住居を読み込んでいます。" : null;
  const loadErrorMessage =
    !normalizedResidenceId || residenceQuery.isError
      ? "住居の読み込みに失敗しました。もう一度お試しください。"
      : null;

  return (
    <ResidenceEditPageContext.Provider
      value={{
        name: "",
        setName: noop,
        rent: "",
        setRent: noop,
        prefecture: "",
        setPrefecture: noop,
        city: "",
        setCity: noop,
        isSubmitting: residenceQuery.isLoading,
        message: loadingMessage,
        errorMessage: loadErrorMessage,
        handleSubmit: noopSubmit,
      }}
    >
      {children}
    </ResidenceEditPageContext.Provider>
  );
}
