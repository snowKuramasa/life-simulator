import { useContext } from "react";

import { ResidenceListPageContext } from "@/providers/pages/ResidenceListPageContext";

export function useResidenceListPage() {
  const residenceListPage = useContext(ResidenceListPageContext);

  if (!residenceListPage) {
    throw new Error("useResidenceListPage must be used within ResidenceListPageProvider");
  }

  return residenceListPage;
}
