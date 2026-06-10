import { ResultList } from "@/components/results/list";
import { useResultListPage } from "@/hooks/useResultListPage";

export function ResultListPage() {
  const {
    results,
    sortKey,
    setSortKey,
    householdSize,
    setHouseholdSize,
    commuteSaveStatuses,
    saveCommuteMinutes,
    isLoading,
    errorMessage,
  } = useResultListPage();

  return (
    <ResultList
      results={results}
      sortKey={sortKey}
      setSortKey={setSortKey}
      householdSize={householdSize}
      setHouseholdSize={setHouseholdSize}
      commuteSaveStatuses={commuteSaveStatuses}
      saveCommuteMinutes={saveCommuteMinutes}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  );
}
