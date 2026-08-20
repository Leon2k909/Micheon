import { getAuthUser, loadScopedJson, saveScopedJson, type UserProfile } from "@/lib/profileStorage";

/**
 * Prices in the learner's own currency.
 *
 * The shop had "£1.99" written into the source as a string, which is fine for
 * one person in Britain and wrong for everyone else — including the German
 * speaker this app was built for, who should not have to convert in her head
 * to find out what a coin pack costs.
 *
 * These are PRICE POINTS, not conversions. Every app store works this way:
 * you pick a tier and each currency has its own round number for it, chosen
 * to look like a price rather than the output of an exchange rate. €2.29 is a
 * price; €2.31 is arithmetic. It also means nothing here goes stale when the
 * pound moves, and no network call is needed in an offline-first app.
 *
 * Payments are not connected, so these are display values. When checkout is
 * wired up the real amounts must come from the payment provider — this table
 * is what the learner is shown, not what anybody is charged.
 */

export type CurrencyCode =
  | "GBP" | "EUR" | "USD" | "CAD" | "AUD"
  | "CHF" | "PLN" | "SEK" | "NOK" | "DKK"
  | "CZK" | "JPY";

/** Four coin-pack tiers, then the monthly Premium price. */
export type PriceTier = 0 | 1 | 2 | 3;

type CurrencyEntry = {
  code: CurrencyCode;
  /** Shown in the picker — the learner's word for it, not ours. */
  label: string;
  /** Coin packs, cheapest first. */
  packs: [number, number, number, number];
  /** Premium, per month. */
  premium: number;
  /** Countries whose locale should default to this currency. */
  regions: string[];
};

const CURRENCIES: CurrencyEntry[] = [
  { code: "GBP", label: "British pound", packs: [1.99, 3.99, 7.99, 14.99], premium: 5.99, regions: ["GB", "IM", "JE", "GG"] },
  { code: "EUR", label: "Euro", packs: [2.29, 4.49, 8.99, 16.99], premium: 6.99, regions: ["DE", "AT", "IE", "FR", "ES", "IT", "NL", "BE", "PT", "FI", "GR", "SK", "SI", "LT", "LV", "EE", "LU", "MT", "CY", "HR"] },
  { code: "USD", label: "US dollar", packs: [2.49, 4.99, 9.99, 17.99], premium: 6.99, regions: ["US", "PR", "EC", "SV"] },
  { code: "CAD", label: "Canadian dollar", packs: [3.49, 6.99, 12.99, 24.99], premium: 8.99, regions: ["CA"] },
  { code: "AUD", label: "Australian dollar", packs: [3.99, 7.99, 14.99, 27.99], premium: 9.99, regions: ["AU"] },
  { code: "CHF", label: "Swiss franc", packs: [2.29, 4.49, 8.99, 16.99], premium: 6.99, regions: ["CH", "LI"] },
  { code: "PLN", label: "Polish złoty", packs: [9.99, 19.99, 39.99, 74.99], premium: 29.99, regions: ["PL"] },
  { code: "SEK", label: "Swedish krona", packs: [25, 49, 99, 189], premium: 79, regions: ["SE"] },
  { code: "NOK", label: "Norwegian krone", packs: [25, 49, 99, 189], premium: 79, regions: ["NO"] },
  { code: "DKK", label: "Danish krone", packs: [19, 35, 69, 129], premium: 55, regions: ["DK"] },
  { code: "CZK", label: "Czech koruna", packs: [49, 99, 199, 379], premium: 159, regions: ["CZ"] },
  { code: "JPY", label: "Japanese yen", packs: [400, 800, 1600, 3000], premium: 1200, regions: ["JP"] },
];

export const CURRENCY_CODES: CurrencyCode[] = CURRENCIES.map((entry) => entry.code);
export const DEFAULT_CURRENCY: CurrencyCode = "GBP";
export const CURRENCY_KEY = "shop-currency";
/** Stored when the learner has not chosen — so a later default change reaches them. */
export const CURRENCY_AUTO = "auto";

export function currencyEntry(code: CurrencyCode): CurrencyEntry {
  return CURRENCIES.find((entry) => entry.code === code) ?? CURRENCIES[0];
}

export function currencyLabel(code: CurrencyCode): string {
  return currencyEntry(code).label;
}

/**
 * The currency this browser most likely wants.
 *
 * Read from the region in the locale ("de-DE" → DE → EUR), not from the
 * language: a German speaker in Switzerland wants francs, and an English
 * speaker in Germany wants euros. Falls back to sterling, which is where the
 * app is made and priced.
 */
export function detectCurrency(locales?: readonly string[]): CurrencyCode {
  const candidates = locales
    ?? (typeof navigator !== "undefined"
      ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language])
      : []);
  for (const locale of candidates) {
    if (!locale) continue;
    // "de-DE", "en-GB-oxendict", "und-Latn-CH" — the region is the first
    // two-letter uppercase subtag, so a script subtag cannot be mistaken for one.
    const region = locale.split("-").find((part) => /^[A-Z]{2}$/.test(part));
    if (!region) continue;
    const match = CURRENCIES.find((entry) => entry.regions.includes(region));
    if (match) return match.code;
  }
  return DEFAULT_CURRENCY;
}

export function loadCurrency(profile: UserProfile | null = getAuthUser()): CurrencyCode {
  const stored = loadScopedJson<string>(CURRENCY_KEY, CURRENCY_AUTO, profile);
  if (stored && stored !== CURRENCY_AUTO && CURRENCY_CODES.includes(stored as CurrencyCode)) {
    return stored as CurrencyCode;
  }
  return detectCurrency();
}

/** Whether the learner picked this, or we guessed it from their locale. */
export function currencyIsAutomatic(profile: UserProfile | null = getAuthUser()): boolean {
  const stored = loadScopedJson<string>(CURRENCY_KEY, CURRENCY_AUTO, profile);
  return !stored || stored === CURRENCY_AUTO;
}

export function saveCurrency(code: CurrencyCode | typeof CURRENCY_AUTO, profile: UserProfile | null = getAuthUser()) {
  saveScopedJson(CURRENCY_KEY, code, profile);
}

/**
 * Format an amount the way the learner's own locale writes money.
 *
 * Intl does the work, so a German sees "6,99 €" with the symbol trailing and
 * a comma for the decimal, and a Briton sees "£6.99" — the same number, each
 * written the way it is actually written there. Zero-decimal currencies (yen)
 * are handled by Intl too rather than by us hardcoding a rule about them.
 */
export function formatMoney(amount: number, code: CurrencyCode, locale?: string): string {
  const resolved = locale
    ?? (typeof navigator !== "undefined" ? navigator.language : undefined)
    ?? "en-GB";
  try {
    return new Intl.NumberFormat(resolved, {
      style: "currency",
      currency: code,
      // JPY has no minor unit; Intl already knows, so let it decide rather
      // than forcing two decimals onto ¥1200.00.
    }).format(amount);
  } catch {
    // A browser without full ICU data still has to show a price.
    return `${code} ${amount.toFixed(2)}`;
  }
}

export function packPrice(tier: PriceTier, code: CurrencyCode, locale?: string): string {
  return formatMoney(currencyEntry(code).packs[tier], code, locale);
}

export function premiumPrice(code: CurrencyCode, locale?: string): string {
  return formatMoney(currencyEntry(code).premium, code, locale);
}

/** Amounts, unformatted — for checks and for a future real checkout. */
export function packAmount(tier: PriceTier, code: CurrencyCode): number {
  return currencyEntry(code).packs[tier];
}
