import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("should format the amount as currency in Brazilian Real (BRL)", () => {
    const testCases = [
      { amount: 1000, expectedFormattedAmount: "R$ 10,00" },
      { amount: 500, expectedFormattedAmount: "R$ 5,00" },
      { amount: 123456789, expectedFormattedAmount: "R$ 1.234.567,89" },
    ];

    testCases.forEach(({ amount, expectedFormattedAmount }) => {
      const result = formatCurrency(amount);

      const normalizedResult = result.replace(/\s/g, "");
      const normalizedExpectedFormattedAmount = expectedFormattedAmount.replace(
        /\s/g,
        ""
      );

      expect(normalizedResult).toEqual(normalizedExpectedFormattedAmount);
    });
  });
});
