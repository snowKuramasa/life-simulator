import { WorkplaceForm } from "@/components/workplaces/form";
import { useWorkplaceNewPage } from "@/hooks/useWorkplaceNewPage";

export function WorkplaceNewPage() {
  const {
    name,
    setName,
    salary,
    setSalary,
    prefecture,
    setPrefecture,
    city,
    setCity,
    isInitialFlow,
    isSubmitting,
    message,
    errorMessage,
    handleSubmit,
  } = useWorkplaceNewPage();

  return (
    <WorkplaceForm
      title="勤務先新規作成画面"
      formId="workplace-form"
      name={name}
      setName={setName}
      salary={salary}
      setSalary={setSalary}
      prefecture={prefecture}
      setPrefecture={setPrefecture}
      city={city}
      setCity={setCity}
      showStepLabel={isInitialFlow}
      submitLabel={isInitialFlow ? "次へ" : "保存"}
      submittingLabel="保存中..."
      isSubmitting={isSubmitting}
      message={message}
      errorMessage={errorMessage}
      handleSubmit={handleSubmit}
    />
  );
}
