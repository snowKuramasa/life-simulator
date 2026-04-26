type CalculateDisposableIncomeParams = {
  monthlyIncome: number;
  fixedCosts: number;
};

export function calculateDisposableIncome({
  monthlyIncome,
  fixedCosts,
}: CalculateDisposableIncomeParams) {
  return monthlyIncome - fixedCosts;
}
