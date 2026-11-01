export const integerFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export const decimalFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const compactFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatKwh(value: number, decimals = false) {
  return `${decimals ? decimalFormatter.format(value) : integerFormatter.format(value)} kWh`;
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
