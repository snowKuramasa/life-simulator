import { ResidenceForm } from "@/components/residences/form";
import { useResidenceEditPage } from "@/hooks/useResidenceEditPage";

export function ResidenceEditPage() {
  const {
    name,
    setName,
    rent,
    setRent,
    prefecture,
    setPrefecture,
    city,
    setCity,
    isSubmitting,
    message,
    errorMessage,
    handleSubmit,
  } = useResidenceEditPage();

  return (
    <ResidenceForm
      title="住居編集画面"
      formId="residence-edit-form"
      name={name}
      setName={setName}
      rent={rent}
      setRent={setRent}
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
