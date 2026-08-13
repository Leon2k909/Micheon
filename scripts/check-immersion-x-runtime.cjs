#!/usr/bin/env node
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const extension = path.join(root, "public", "micheon-immersion-extension");
const glossSource = fs.readFileSync(path.join(extension, "src", "content-gloss.js"), "utf8");
const words = fs.readFileSync(path.join(extension, "data", "words.json"), "utf8");

class FakeHighlight extends Set {}

async function main() {
  const dom = new JSDOM(`<!doctype html><html lang="de"><body>
    <header role="banner"><nav role="navigation">
      <button id="more">Mehr</button><button>Entdecken</button><button>Mitteilungen</button>
    </nav></header>
    <main id="feed"><article><div data-testid="tweetText">
      Willst du noch mehr? Die Punktzahl wäre gegenüber gestern besser.
      Das wurde gesagt und später zurückgegeben. Dieses unbekanntesfeedwort darf den Scanner nicht aufhängen.
    </div></article></main>
  </body></html>`, {
    url: "https://x.com/home",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const highlights = new Map();
  window.Highlight = FakeHighlight;
  window.CSS = { highlights: {
    set: (name, value) => highlights.set(name, value),
    get: (name) => highlights.get(name),
  } };
  window.fetch = async () => ({ json: async () => JSON.parse(words) });
  window.chrome = {
    runtime: {
      getURL: () => "data/words.json",
      sendMessage: () => Promise.resolve(),
      onMessage: { addListener() {} },
    },
    storage: {
      local: {
        get: async () => ({ settings: { collectMissingVocab: false, ttsOnHover: false, ttsOnClick: false } }),
        set: async () => {},
      },
      onChanged: { addListener() {} },
    },
  };

  window.eval(glossSource);
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  const highlighted = [...(highlights.get("micheon-gloss") || [])].map((range) => range.toString());
  for (const label of ["Mehr", "Entdecken", "Mitteilungen"]) {
    assert(highlighted.includes(label), `${label} was not highlighted in X navigation`);
  }
  assert(highlighted.includes("mehr"), "lowercase mehr was not highlighted in tweet text");
  for (const word of ["Punktzahl", "wäre", "gegenüber", "gesagt", "zurückgegeben"]) {
    assert(highlighted.includes(word), `${word} was not resolved against the authored Immersion catalogue`);
  }
  assert(highlighted.length < 30, `unexpected runaway range creation: ${highlighted.length}`);

  const feed = window.document.getElementById("feed");
  const started = Date.now();
  for (let index = 0; index < 500; index += 1) {
    const article = window.document.createElement("article");
    article.innerHTML = `<div data-testid="tweetText">Noch mehr unbekanntesfeedwort ${index}</div>`;
    feed.replaceChildren(article);
  }
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  assert(Date.now() - started < 3000, "X feed recycling took unexpectedly long");
  assert((highlights.get("micheon-gloss")?.size || 0) < 20,
    "detached X highlights accumulated after feed recycling");

  console.log("Immersion X runtime checks passed (unknown words, Mehr nav, 500 recycled posts).");
  window.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
