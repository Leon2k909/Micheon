#!/usr/bin/env node
/**
 * Prices in the learner's own currency.
 *
 * The shop had "£1.99" written into the source as a string. That is correct
 * for one person in Britain and wrong for everyone else, including the German
 * speaker this app was built for.
 *
 * The failures worth guarding are quiet ones. A missing price point renders
 * "undefined" or NaN where a price should be. A currency the picker offers
 * but the table has no prices for shows an empty pack. Locale detection that
 * reads the LANGUAGE rather than the region gives a German speaker in Zurich
 * euros. And prices that are exchange-rate arithmetic rather than price
 * points look like arithmetic — €2.31 is not a price anyone charges.
 */
const assert = require("assert");
const path = require("path");
const Module = require("module");
const fs = require("fs");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const built = esbuild.buildSync({
  stdin: {
    contents: 'export * from "./src/lib/currency.ts";',
    resolveDir: root,
    sourcefile: "currency-entry.ts",
  },
  alias: { "@": path.join(root, "src") },
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  write: false,
  logLevel: "silent",
});

global.window = undefined;
const compiled = new Module("currency", module);
compiled.filename = path.join(root, ".currency.cjs");
compiled.paths = Module._nodeModulePaths(root);
compiled._compile(built.outputFiles[0].text, compiled.filename);
const M = compiled.exports;

// ── every offered currency can actually price the shop ──────────────────────
assert.ok(M.CURRENCY_CODES.length >= 8, `only ${M.CURRENCY_CODES.length} currencies offered`);
for (const code of M.CURRENCY_CODES) {
  const entry = M.currencyEntry(code);
  assert.strictEqual(entry.code, code, `currencyEntry("${code}") returned ${entry.code}`);
  assert.strictEqual(entry.packs.length, 4, `${code} does not price all four coin packs`);
  for (const [tier, amount] of entry.packs.entries()) {
    assert.ok(
      typeof amount === "number" && Number.isFinite(amount) && amount > 0,
      `${code} tier ${tier} is not a usable amount: ${amount}`
    );
  }
  assert.ok(entry.premium > 0, `${code} has no Premium price`);
  // Cheapest first, or the shop lists a bigger pack for less than a smaller one.
  for (let tier = 1; tier < entry.packs.length; tier += 1) {
    assert.ok(
      entry.packs[tier] > entry.packs[tier - 1],
      `${code} prices tier ${tier} (${entry.packs[tier]}) at or below tier ${tier - 1} (${entry.packs[tier - 1]})`
    );
  }
  assert.ok(entry.label && entry.label.trim().length > 2, `${code} has no label for the picker`);
  assert.ok(entry.regions.length > 0, `${code} is offered but no locale ever selects it`);
}

// No region claimed twice, or detection depends on table order.
const claimed = new Map();
for (const code of M.CURRENCY_CODES) {
  for (const region of M.currencyEntry(code).regions) {
    assert.ok(!claimed.has(region), `${region} is claimed by both ${claimed.get(region)} and ${code}`);
    claimed.set(region, code);
  }
}

// ── every price formats as money, in every currency ─────────────────────────
for (const code of M.CURRENCY_CODES) {
  for (const tier of [0, 1, 2, 3]) {
    const shown = M.packPrice(tier, code, "en-GB");
    assert.ok(shown && !/undefined|NaN|Infinity/.test(shown), `${code} tier ${tier} renders as "${shown}"`);
    assert.ok(/\d/.test(shown), `${code} tier ${tier} shows no number: "${shown}"`);
  }
  const premium = M.premiumPrice(code, "en-GB");
  assert.ok(premium && !/undefined|NaN/.test(premium), `${code} Premium renders as "${premium}"`);
}

// ── the locale decides, and it decides on REGION not language ───────────────
// A German speaker in Switzerland wants francs; an English speaker in Germany
// wants euros. Reading the language would get both backwards.
assert.strictEqual(M.detectCurrency(["de-DE"]), "EUR", "a German locale should price in euros");
assert.strictEqual(M.detectCurrency(["de-CH"]), "CHF", "German in Switzerland is francs, not euros");
assert.strictEqual(M.detectCurrency(["en-DE"]), "EUR", "English in Germany is still euros");
assert.strictEqual(M.detectCurrency(["en-GB"]), "GBP");
assert.strictEqual(M.detectCurrency(["en-US"]), "USD");
assert.strictEqual(M.detectCurrency(["ja-JP"]), "JPY");
// A script subtag is four letters and must not be mistaken for a region.
assert.strictEqual(M.detectCurrency(["zh-Hans-US"]), "USD", "the script subtag confused the region parser");
// Unknown or absent locales fall back rather than throwing or showing nothing.
assert.strictEqual(M.detectCurrency(["xx-ZZ"]), M.DEFAULT_CURRENCY, "an unknown region should fall back");
assert.strictEqual(M.detectCurrency([]), M.DEFAULT_CURRENCY, "no locale at all should fall back");
assert.strictEqual(M.detectCurrency(["de"]), M.DEFAULT_CURRENCY, "a language with no region cannot be placed");
// The first locale that can be placed wins, so a browser listing several is
// not decided by whichever happens to be last.
assert.strictEqual(M.detectCurrency(["de-AT", "en-US"]), "EUR");

// ── formatted the way that locale writes money ──────────────────────────────
// Intl does this, so a German sees the symbol trailing and a comma decimal.
const german = M.formatMoney(6.99, "EUR", "de-DE");
assert.ok(german.includes("6,99"), `a German locale should write 6,99 — got "${german}"`);
assert.ok(german.includes("€"), `the euro sign is missing from "${german}"`);
const british = M.formatMoney(5.99, "GBP", "en-GB");
assert.ok(british.startsWith("£5.99"), `a British locale should write £5.99 — got "${british}"`);
// Yen has no minor unit, and Intl knows that. Hardcoding two decimals here
// would print ¥1,200.00, which is not how yen is written anywhere.
const yen = M.formatMoney(1200, "JPY", "ja-JP");
assert.ok(!/\.\d\d/.test(yen), `yen should carry no decimals — got "${yen}"`);

// ── price points, not exchange-rate arithmetic ──────────────────────────────
// Every amount should look like a price somebody would actually charge.
for (const code of M.CURRENCY_CODES) {
  const entry = M.currencyEntry(code);
  for (const amount of [...entry.packs, entry.premium]) {
    const cents = Math.round(amount * 100) % 100;
    assert.ok(
      cents === 0 || cents === 49 || cents === 95 || cents === 99 || cents === 29 || cents === 89 || cents === 79 || cents === 39,
      `${code} prices something at ${amount} — that reads as a converted rate rather than a price point`
    );
  }
}

// ── nothing in the shop still hardcodes a symbol ────────────────────────────
const shop = fs.readFileSync(path.join(root, "src/prototype/NewUiPrototype.tsx"), "utf8");
// Comments stripped first. The comment explaining WHY prices are no longer
// written as "£1.99" contains the string "£1.99", and a check that fires on
// its own rationale is a check nobody will keep.
const shopCode = shop
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split(/\r?\n/)
  .map((line) => line.replace(/^\s*(\/\/|\*).*$/, ""))
  .join("\n");
const hardcoded = shopCode.match(/["'`][^"'`]*£\d/g) || [];
assert.strictEqual(
  hardcoded.length,
  0,
  `the shop still writes a price as a string: ${hardcoded.slice(0, 3).join(", ")}`
);
assert.ok(shop.includes("packPrice(pack.tier, currency)"), "the coin packs are not priced from the currency table");
assert.ok(shop.includes("premiumPrice(currency)"), "Premium is not priced from the currency table");
assert.ok(shop.includes('data-testid="shop-currency"'), "there is no way for the learner to change currency");

console.log(
  `check-currency: ${M.CURRENCY_CODES.length} currencies, ${M.CURRENCY_CODES.length * 5} price points, `
  + `each a real price point and formatted by its own locale; region decides, not language`
);
