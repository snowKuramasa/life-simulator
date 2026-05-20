import { useContext } from "react";

import { WorkplaceNewPageContext } from "@/providers/pages/WorkplaceNewPageContext";

export function useWorkplaceNewPage() {
  const workplaceNewPage = useContext(WorkplaceNewPageContext);

  if (!workplaceNewPage) {
    throw new Error("useWorkplaceNewPage must be used within WorkplaceNewPageProvider");
  }

  return workplaceNewPage;
}
