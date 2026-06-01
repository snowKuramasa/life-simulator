import { useContext } from "react";

import { ResidenceEditPageContext } from "@/providers/pages/ResidenceEditPageContext";

export function useResidenceEditPage() {
  const residenceEditPage = useContext(ResidenceEditPageContext);

  if (!residenceEditPage) {
    throw new Error("useResidenceEditPage must be used within ResidenceEditPageProvider");
  }

  return residenceEditPage;
}
