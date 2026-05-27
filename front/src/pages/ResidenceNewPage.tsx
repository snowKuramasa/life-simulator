import { ResidenceForm } from "@/components/residences/form";
import { useResidenceNewPage } from "@/hooks/useResidenceNewPage";

export function ResidenceNewPage() {
  const {
    name,
    setName,
    rent,
    setRent,
    prefecture,
    setPrefecture,
    city,
    setCity,
    isInitialFlow,
    isSubmitting,
    message,
    errorMessage,
    handleSubmit,
  } = useResidenceNewPage();

  return (
    <ResidenceForm
      title="住居新規作成画面"
      formId="residence-form"
      name={name}
      setName={setName}
      rent={rent}
      setRent={setRent}
      prefecture={prefecture}
      setPrefecture={setPrefecture}
      city={city}
      setCity={setCity}
      showStepLabel={isInitialFlow}
      submitLabel={isInitialFlow ? "結果を見る" : "保存"}
      submittingLabel="保存中..."
      isSubmitting={isSubmitting}
      message={message}
      errorMessage={errorMessage}
      handleSubmit={handleSubmit}
    />
  );
}
