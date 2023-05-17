export const formatCurrency = (amount: number) => {
  const reais = Math.floor(amount / 100);
  const cents = amount % 100;

  const formattedAmount = `R$ ${reais.toLocaleString("pt-BR")},${cents
    .toString()
    .padStart(2, "0")}`;
  return formattedAmount;
};
