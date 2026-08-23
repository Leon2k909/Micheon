import { ChevronDown } from "lucide-react";
import { ui } from "@/lib/i18n";

/**
 * Who and what Micheon is built on.
 *
 * This exists because two of the things the app ships are other people's work
 * under licences that ask to be named: the word pictures are Twemoji (CC-BY
 * 4.0), and a fifth of the sentence practice is still drawn from the Tatoeba
 * corpus (CC-BY 2.0 FR). A line of small print at the bottom of the profile
 * page was the wrong place for that — it was easy to miss and impossible to
 * add to.
 *
 * Attribution here is not decoration. CC-BY requires it, and it requires it
 * for adaptations too, so a sentence that has been edited still counts. The
 * Tatoeba credit can only come out when the last Tatoeba-derived sentence
 * does; see check-word-pictures, which fails the build if the artwork is
 * shipped without its credit.
 *
 * FOLDED SHUT by default, because four cards of licence text at the foot of
 * the profile page was more room than it deserved. Folded is not hidden: it
 * is a <details>, so the names and licences stay in the page whether it is
 * open or not, one press reaches them, and the browser's own find-in-page
 * opens it. Replacing it with a link to somewhere else would be the version
 * that breaks the licence.
 */
type Credit = {
  body: string;
  href: string;
  licence: string;
  title: string;
};

const CREDITS: Credit[] = [
  {
    title: "Twemoji",
    href: "https://github.com/jdecked/twemoji",
    licence: "CC BY 4.0",
    body: "The pictures beside the words. Around eight hundred of them ship with the app, so they look the same on every machine and work with no connection.",
  },
  {
    title: "Tatoeba",
    href: "https://tatoeba.org",
    licence: "CC BY 2.0 FR",
    body: "Part of the real-sentence practice. Most of the course is written for Micheon, and the share coming from here falls with every pack that replaces it.",
  },
  {
    title: "Lucide",
    href: "https://lucide.dev",
    licence: "ISC",
    body: "The interface icons.",
  },
  {
    title: "Electron, React and Vite",
    href: "https://www.electronjs.org",
    licence: "MIT",
    body: "What the desktop app is built with.",
  },
];

export function CreditsCard() {
  return (
    <details className="credits-fold">
      <summary className="credits-fold__summary">
        <span className="credits-fold__label">{ui("Credits and licences")}</span>
        <ChevronDown aria-hidden="true" className="credits-fold__chevron" />
      </summary>

      <p className="mt-3 text-xs font-semibold leading-5 text-[var(--text-3)]">
        {ui("Micheon is written by Leon and Michelle. These are the pieces it stands on, and the licences they are used under.")}
      </p>
      <ul className="mt-3 space-y-2">
        {CREDITS.map((credit) => (
          <li key={credit.title} className="rounded-xl bg-[var(--surface-2)] p-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <a
                className="text-sm font-black text-[var(--text-1)] underline decoration-[var(--border)] underline-offset-2 transition-colors hover:text-[var(--accent)]"
                href={credit.href}
                rel="noreferrer"
                target="_blank"
              >
                {credit.title}
              </a>
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {credit.licence}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-3)]">{ui(credit.body)}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}
