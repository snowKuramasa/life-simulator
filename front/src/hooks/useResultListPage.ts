import { useContext } from "react";

import { ResultListPageContext } from "@/providers/pages/ResultListPageContext";

export function useResultListPage() {
  const resultListPage = useContext(ResultListPageContext);

  if (!resultListPage) {
    throw new Error("useResultListPage must be used within ResultListPageProvider");
  }

  return resultListPage;
}
