/** Vanuatu Vatu — ISO 4217: VUV (no minor units). */
export const CURRENCY_CODE = "VUV";
export const CURRENCY_LOCALE = "en-VU";
export const CURRENCY_LABEL = "Vanuatu Vatu";
export const CURRENCY_SYMBOL = "VT";

const vatuFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY_CODE,
  currencyDisplay: "symbol",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Format an amount in Vanuatu Vatu, e.g. "VT 85,000". */
export function formatVatu(amount: number): string {
  const formatted = vatuFormatter.format(amount);
  // Some runtimes render "VUV" instead of "VT" — normalize for school UI.
  return formatted.replace(/VUV/g, CURRENCY_SYMBOL).replace(/\u00a0/g, " ");
}

/** Compact display for dashboard tiles, e.g. "VT 4.9M". */
export function formatVatuCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const value =
      millions >= 10 ? millions.toFixed(0) : millions.toFixed(1).replace(/\.0$/, "");
    return `${CURRENCY_SYMBOL} ${value}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    const value =
      thousands >= 10
        ? thousands.toFixed(0)
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `${CURRENCY_SYMBOL} ${value}k`;
  }
  return formatVatu(amount);
}
