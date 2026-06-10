import { ResidenceList } from "@/components/residences/list";
import { useResidenceListPage } from "@/hooks/useResidenceListPage";

export function ResidenceListPage() {
  const { residences, isLoading, deletingId, message, errorMessage, handleDelete } =
    useResidenceListPage();

  return (
    <ResidenceList
      residences={residences}
      isLoading={isLoading}
      deletingId={deletingId}
      message={message}
      errorMessage={errorMessage}
      handleDelete={handleDelete}
    />
  );
}
