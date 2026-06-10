import { useContext } from "react";

import { ResidenceNewPageContext } from "@/providers/pages/ResidenceNewPageContext";

export function useResidenceNewPage() {
  const residenceNewPage = useContext(ResidenceNewPageContext);

  if (!residenceNewPage) {
    throw new Error("useResidenceNewPage must be used within ResidenceNewPageProvider");
  }

  return residenceNewPage;
}
