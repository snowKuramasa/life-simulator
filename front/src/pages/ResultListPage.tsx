import { ResultList } from "@/components/results/list";
import { useResultListPage } from "@/hooks/useResultListPage";

export function ResultListPage() {
  const { results, sortKey, setSortKey, isLoading, errorMessage } = useResultListPage();

  return (
    <ResultList
      results={results}
      sortKey={sortKey}
      setSortKey={setSortKey}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  );
}
