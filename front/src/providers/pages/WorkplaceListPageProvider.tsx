import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { useDeleteWorkplaceMutation, useWorkplacesQuery } from "@/hooks/workplaces/useWorkplaceQueries";
import { WorkplaceListPageContext } from "@/providers/pages/WorkplaceListPageContext";

type WorkplaceListPageProviderProps = {
  children: ReactNode;
};

export function WorkplaceListPageProvider({ children }: WorkplaceListPageProviderProps) {
  const queryClient = useQueryClient();
  const workplacesQuery = useWorkplacesQuery();
  const deleteWorkplace = useDeleteWorkplaceMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setMessage(null);
    setErrorMessage(null);
    setDeletingId(id);

    try {
      await deleteWorkplace.mutateAsync(id);
      await queryClient.invalidateQueries({ queryKey: ["workplaces"] });
      setMessage("勤務先を削除しました。");
    } catch {
      setErrorMessage("勤務先の削除に失敗しました。もう一度お試しください。");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <WorkplaceListPageContext.Provider
      value={{
        workplaces: workplacesQuery.data?.workplaces ?? [],
        isLoading: workplacesQuery.isLoading,
        deletingId,
        message,
        errorMessage: workplacesQuery.isError
          ? "勤務先一覧の読み込みに失敗しました。もう一度お試しください。"
          : errorMessage,
        handleDelete,
      }}
    >
      {children}
    </WorkplaceListPageContext.Provider>
  );
}
