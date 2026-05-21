import { WorkplaceForm } from "@/components/workplaces/form";
import { useWorkplaceEditPage } from "@/hooks/useWorkplaceEditPage";

export function WorkplaceEditPage() {
  const {
    name,
    setName,
    salary,
    setSalary,
    prefecture,
    setPrefecture,
    city,
    setCity,
    isSubmitting,
    message,
    errorMessage,
    handleSubmit,
  } = useWorkplaceEditPage();

  return (
    <WorkplaceForm
      title="勤務先編集画面"
      formId="workplace-edit-form"
      name={name}
      setName={setName}
      salary={salary}
      setSalary={setSalary}
      prefecture={prefecture}
      setPrefecture={setPrefecture}
      city={city}
      setCity={setCity}
      submitLabel="保存"
      submittingLabel="保存中..."
      isSubmitting={isSubmitting}
      message={message}
      errorMessage={errorMessage}
      handleSubmit={handleSubmit}
    />
  );
}
