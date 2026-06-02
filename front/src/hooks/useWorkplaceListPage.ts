import { useContext } from "react";

import { WorkplaceListPageContext } from "@/providers/pages/WorkplaceListPageContext";

export function useWorkplaceListPage() {
  const workplaceListPage = useContext(WorkplaceListPageContext);

  if (!workplaceListPage) {
    throw new Error("useWorkplaceListPage must be used within WorkplaceListPageProvider");
  }

  return workplaceListPage;
}
