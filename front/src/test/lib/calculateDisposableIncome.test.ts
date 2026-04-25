import { describe, expect, it } from "vitest";

import { calculateDisposableIncome } from "@/lib/calculateDisposableIncome";

describe("calculateDisposableIncome", () => {
  it("subtracts fixed costs from monthly income", () => {
    expect(
      calculateDisposableIncome({
        monthlyIncome: 280000,
        fixedCosts: 120000,
      }),
    ).toBe(160000);
  });

  it("returns zero when income and fixed costs are the same", () => {
    expect(
      calculateDisposableIncome({
        monthlyIncome: 180000,
        fixedCosts: 180000,
      }),
    ).toBe(0);
  });

  it("returns a negative number when fixed costs exceed income", () => {
    expect(
      calculateDisposableIncome({
        monthlyIncome: 150000,
        fixedCosts: 190000,
      }),
    ).toBe(-40000);
  });
});
