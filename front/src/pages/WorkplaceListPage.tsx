import { WorkplaceList } from "@/components/workplaces/list";
import { useWorkplaceListPage } from "@/hooks/useWorkplaceListPage";

export function WorkplaceListPage() {
  const { workplaces, isLoading, deletingId, message, errorMessage, handleDelete } =
    useWorkplaceListPage();

  return (
    <WorkplaceList
      workplaces={workplaces}
      isLoading={isLoading}
      deletingId={deletingId}
      message={message}
      errorMessage={errorMessage}
      handleDelete={handleDelete}
    />
  );
}
