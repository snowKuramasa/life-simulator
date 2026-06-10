import { STANDARD_MONTHLY_LIVING_COST } from "@/constants/livingCosts";

type CalculateMonthlySurplusParams = {
  monthlyIncome: number;
  rent: number;
  monthlyLivingCost?: number;
};

export function calculateMonthlySurplus({
  monthlyIncome,
  rent,
  monthlyLivingCost = STANDARD_MONTHLY_LIVING_COST,
}: CalculateMonthlySurplusParams) {
  return monthlyIncome - rent - monthlyLivingCost;
}
