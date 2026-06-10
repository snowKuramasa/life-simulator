import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { useDeleteResidenceMutation, useResidencesQuery } from "@/hooks/residences/useResidenceQueries";
import { ResidenceListPageContext } from "@/providers/pages/ResidenceListPageContext";

type ResidenceListPageProviderProps = {
  children: ReactNode;
};

export function ResidenceListPageProvider({ children }: ResidenceListPageProviderProps) {
  const queryClient = useQueryClient();
  const residencesQuery = useResidencesQuery();
  const deleteResidence = useDeleteResidenceMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setMessage(null);
    setErrorMessage(null);
    setDeletingId(id);

    try {
      await deleteResidence.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ["residences"] });
      setMessage("住居を削除しました。");
    } catch {
      setErrorMessage("住居の削除に失敗しました。もう一度お試しください。");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ResidenceListPageContext.Provider
      value={{
        residences: residencesQuery.data?.residences ?? [],
        isLoading: residencesQuery.isLoading,
        deletingId,
        message,
        errorMessage: residencesQuery.isError
          ? "住居一覧の読み込みに失敗しました。もう一度お試しください。"
          : errorMessage,
        handleDelete,
      }}
    >
      {children}
    </ResidenceListPageContext.Provider>
  );
}
