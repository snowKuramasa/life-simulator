type CalculateDisposableIncomeParams = {
  monthlyIncome: number;
  fixedCosts: number;
};

// バックエンドの計算ロジックと同じ考え方で、
// フロント側でも可処分所得の簡易計算を行うためのヘルパー関数です。
export function calculateDisposableIncome({
  monthlyIncome,
  fixedCosts,
}: CalculateDisposableIncomeParams) {
  return monthlyIncome - fixedCosts;
}
