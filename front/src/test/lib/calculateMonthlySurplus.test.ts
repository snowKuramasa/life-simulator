import { describe, expect, it } from "vitest";

import { calculateMonthlySurplus } from "@/lib/calculateMonthlySurplus";

describe("calculateMonthlySurplus", () => {
  it("subtracts rent and standard living cost from monthly income", () => {
    expect(
      calculateMonthlySurplus({
        monthlyIncome: 220000,
        rent: 80000,
      }),
    ).toBe(0);
  });

  it("returns a positive amount when income exceeds rent and living cost", () => {
    expect(
      calculateMonthlySurplus({
        monthlyIncome: 300000,
        rent: 80000,
      }),
    ).toBe(80000);
  });

  it("accepts a custom living cost", () => {
    expect(
      calculateMonthlySurplus({
        monthlyIncome: 220000,
        rent: 80000,
        monthlyLivingCost: 100000,
      }),
    ).toBe(40000);
  });
});
