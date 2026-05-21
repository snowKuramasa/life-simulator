import { useContext } from "react";

import { WorkplaceEditPageContext } from "@/providers/pages/WorkplaceEditPageContext";

export function useWorkplaceEditPage() {
  const workplaceEditPage = useContext(WorkplaceEditPageContext);

  if (!workplaceEditPage) {
    throw new Error("useWorkplaceEditPage must be used within WorkplaceEditPageProvider");
  }

  return workplaceEditPage;
}
