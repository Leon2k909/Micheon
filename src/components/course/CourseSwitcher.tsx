import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Lock, Search, Star, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES, sortCoursesByName, visibleLanguageRows } from "@/lib/courseRegistry";
import { availablePacks, removePack } from "@/lib/contentPacks";
import { FAVOURITE_COURSES_EVENT, getFavouriteCourses, getFavouritesOpen, setFavouritesOpen, toggleFavouriteCourse } from "@/lib/favouriteCourses";
import { COUNTRY_PACKS } from "@/lib/countryPacks";
import { PLANNED_LANGUAGES } from "@/lib/languageCatalogue";
import { FlagRoundel, hasFlagArt } from "@/components/course/FlagRoundel";
import { ui, uiFmt, uiLocale } from "@/lib/i18n";

/**
 * Which course a language pack belongs to.
 *
 * The manifest names packs by language code, because that is what the tables
 * are keyed by; the picker lists courses. One map rather than a guess at every
 * use, and adding a language means a line here beside the one in
 * translations.ts.
 */
const COURSE_BY_PACK: Record<string, string> = { fr: "french", pl: "polish", es: "spanish", pt: "portuguese" };

const COURSE_SEARCH_ALIASES: Record<string, string> = {
  german: "de deutsch germany deutschland alemann allemand",
  spanish: "es espanol español spain spanisch espagnol",
  portuguese: "pt portugues português portugal portugiesisch portugais",
  french: "fr francais français france franzosisch französisch",
  csharp: "c# c sharp dotnet .net programming coding sandbox sbox s&box",
  // Searching a variant by name still reaches it, even though the two share
  // one row: "american" narrows to the US card, "english" keeps them merged.
  "english-uk": "english britisch british uk gb england colour practise timetable englisch",
  "english-us": "english amerikanisch american us usa color practice schedule englisch",
  "life-in-the-uk": "life in the uk citizenship test british history government settlement indefinite leave to remain ilr home office",
  "leben-in-deutschland": "leben in deutschland einbürgerungstest orientierungskurs integrationskurs staatsangehörigkeit grundgesetz politik geschichte gesellschaft bamf",
  "vivre-en-france": "vivre en france examen civique naturalisation nationalite francaise laicite republique marianne institutions frankreich landeskunde staatsburgerschaft",
  // No test words here: Poland has no civics exam, and offering one in the
  // search would promise something the course does not contain.
  "zycie-w-polsce": "zycie w polsce polen poland polska landeskunde geschichte gesellschaft ustroj historia sejm solidarnosc konstytucja polnisch",
  // Endonyms and alternative spellings for everything in the catalogue, so
  // searching "nihongo" or "espanol" finds the right row.
  ...Object.fromEntries(PLANNED_LANGUAGES.map((language) => [language.id, language.search])),
};

/** Diacritics fold away, so "cestina" matches "čeština" and vice versa. */
function foldForSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function CourseArtwork({ id }: { id: string }) {
  // A country course is not a language, so its id appears in neither the
  // gradient list below nor the flag art keyed by language — every one of
  // them fell through to the globe placeholder. The pack knows which flag
  // its country flies, which is the same one the sidebar and the home card
  // already draw for it.
  const countryFlagId = COUNTRY_PACKS.find((entry) => entry.course.id === id)?.flagId;
  if (countryFlagId) return <FlagRoundel id={countryFlagId} />;

  if (id === "csharp") {
    return (
      <img
        alt=""
        className="h-9 w-9 rounded-[11px] object-cover shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
        src="/course-assets/sbox-game.ico"
      />
    );
  }

  const backgroundImage = id === "german"
    ? "linear-gradient(to bottom, #181818 0 33.333%, #dd0000 33.333% 66.666%, #ffce00 66.666% 100%)"
    : id === "spanish"
      ? "linear-gradient(to bottom, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%)"
      : id === "french"
        ? "linear-gradient(to right, #0055a4 0 33.333%, #ffffff 33.333% 66.666%, #ef4135 66.666% 100%)"
        : null;

  if (!backgroundImage) {
    // Windows renders flag emoji as bare letter pairs, so the catalogue's
    // flags are drawn as SVG art instead — same picture on every platform.
    if (hasFlagArt(id)) return <FlagRoundel id={id} />;
    const icon = PLANNED_LANGUAGES.find((language) => language.id === id)?.icon ?? "🌍";
    return <span aria-hidden="true" className="text-2xl leading-none">{icon}</span>;
  }

  return (
    <span
      aria-hidden="true"
      className="block h-8 w-8 rounded-full border-2 border-[var(--surface)] shadow-[0_2px_8px_rgba(20,20,20,0.18)]"
      style={{ backgroundImage }}
    />
  );
}

export function CourseSwitcher({
  open,
  activeCountryCourseId,
  activeCourseId,
  onSelect,
  onClose,
  scope,
}: {
  open: boolean;
  /**
   * The country course currently selected.
   *
   * Country studies keeps its own choice, separate from the language
   * course, so activeCourseId never names one. Without this the country
   * section drew three rows and a tick on none of them.
   */
  activeCountryCourseId: string;
  activeCourseId: string;
  onSelect: (courseId: string) => void;
  onClose: () => void;
  /**
   * What the dialog is being opened to change.
   *
   * "all" is the whole catalogue, which is right when the question is
   * "what do you want to learn". "country" narrows it to the country
   * courses, because opening it from the country card and landing on a
   * list of eighty-seven languages makes the obvious click the wrong
   * one — you set out to change the country and changed the language.
   */
  scope: "all" | "country";
}) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const normalizedQuery = foldForSearch(query.trim());
  /**
   * The half of the catalogue this dialog is for.
   *
   * Country studies and language learning are two separate choices, so
   * the dialog that changes one does not list the other — not in its
   * sections, not in its favourites, and not in its search results. It
   * used to show the country courses in both, which is how choosing a
   * country and choosing a language kept reaching each other.
   *
   * Filtered at the catalogue rather than at each section, so a section
   * added later cannot forget to ask.
   */
  const inScope = useCallback(
    (course: (typeof COURSES)[number]) => (scope === "country"
      ? course.kind === "citizenship"
      : course.kind !== "citizenship"),
    [scope]
  );
  const scopedCourses = useMemo(() => COURSES.filter(inScope), [inScope]);
  const visibleCourses = useMemo(() => {
    if (!normalizedQuery) return scopedCourses;
    return scopedCourses.filter((course) => {
      const corpus = [
        course.id,
        course.name,
        ui(course.name),
        course.tagline,
        ui(course.tagline),
        COURSE_SEARCH_ALIASES[course.id] ?? "",
      ].join(" ");
      const folded = foldForSearch(corpus);
      return normalizedQuery.split(/\s+/).every((term) => folded.includes(term));
    });
  }, [normalizedQuery, scopedCourses]);
  const allLanguages = visibleCourses.filter((c) => c.kind === "language");
  // The two English rows are folded into one card — see EnglishCard. They are
  // pulled out here rather than filtered inside the list so the count above
  // the section stays honest about how many rows are actually drawn.
  const englishUk = allLanguages.find((c) => c.id === "english-uk");
  const englishUs = allLanguages.find((c) => c.id === "english-us");
  const mergedEnglish = englishUk && englishUs ? { uk: englishUk, us: englishUs } : null;
  // english-uk stays in the list and stands for the merged card, so the card
  // sorts into place under its own name instead of being pinned above a
  // sorted list, where it read as the one row out of order.
  const languages = mergedEnglish
    ? allLanguages.filter((c) => c.id !== "english-us")
    : allLanguages;
  const languageRowCount = languages.length;

  /**
   * Only German is taught; the other eighty-odd rows say Coming soon.
   *
   * Drawing all of them cost 123 ms of render on every open, for 12,324px of
   * list in a window that shows about six hundred — so the wait was almost
   * entirely for rows nobody had scrolled to. The ones that can actually be
   * chosen are drawn immediately and the rest wait to be asked for.
   *
   * Searching shows everything that matches, because that is the question the
   * long list exists to answer: is my language in here? Typing "farsi" must
   * still find Persian without pressing anything first.
   */
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  /**
   * Downloads this device is holding, by the course that pulled them in.
   *
   * The manifest names packs by language code and the picker lists courses, so
   * the two are married here rather than at every use. Only languages have
   * packs today; a course with none simply shows nothing.
   */
  const [installedPacks, setInstalledPacks] = useState<Array<{ course: string; url: string }>>([]);
  const [removing, setRemoving] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void availablePacks()
      .then(({ languages, installed }) => {
        if (!live) return;
        setInstalledPacks(languages
          .filter((pack) => installed.some((entry) => entry.endsWith(pack.url)))
          .map((pack) => ({ course: COURSE_BY_PACK[pack.id] ?? pack.id, url: pack.url }))
          .filter((entry) => Boolean(entry.course)));
      })
      // No manifest means the build emitted no packs, which is a real state:
      // the app runs on its bundled content and nothing is removable.
      .catch(() => { if (live) setInstalledPacks([]); });
    return () => { live = false; };
  }, []);
  /**
   * Starred courses, newest last. Read on mount and kept in step through the
   * event, so starring in one place redraws both sections at once.
   */
  const [favourites, setFavourites] = useState<string[]>(() => getFavouriteCourses());
  useEffect(() => {
    const refresh = () => setFavourites(getFavouriteCourses());
    window.addEventListener(FAVOURITE_COURSES_EVENT, refresh);
    return () => window.removeEventListener(FAVOURITE_COURSES_EVENT, refresh);
  }, []);
  const isFavourite = (id: string) => favourites.includes(id);
  const star = (id: string) => setFavourites(toggleFavouriteCourse(id));
  // Keyed on the scope, so the two dialogs fold independently — and reset
  // when the dialog is reopened in the other scope, which is what the key
  // in the state is for.
  const [favouritesOpen, setFavouritesOpenState] = useState(() => getFavouritesOpen(scope));
  useEffect(() => setFavouritesOpenState(getFavouritesOpen(scope)), [scope]);
  const toggleFavourites = () => {
    setFavouritesOpenState((was) => {
      setFavouritesOpen(!was, scope);
      return !was;
    });
  };
  const searching = Boolean(normalizedQuery);
  /**
   * Starred courses come out of their own section and go to the top.
   *
   * Not while searching: then the question is whether a language is in here at
   * all, and an answer split across two sections is half hidden.
   *
   * English is one card standing for two ids, so it counts as starred if
   * either spelling is — and it is starred under the UK id, which is the one
   * the card hands to the store.
   */
  const countryOnly = scope === "country";
  const englishStarred = !countryOnly && Boolean(mergedEnglish)
    && (isFavourite("english-uk") || isFavourite("english-us"));
  const groupFavourites = !searching && favourites.length > 0;
  const isPickedOut = (id: string) => groupFavourites && isFavourite(id);

  // Read in the interface language, so sorted by the name on the row rather
  // than the English one underneath it. Favourites are left alone: they are
  // in the order they were starred, on purpose, so the section a learner
  // arranged does not rearrange itself.
  const inNameOrder = <T extends { name: string }>(list: T[]) => sortCoursesByName(list, ui, uiLocale());
  const shownLanguages = inNameOrder(
    visibleLanguageRows(languages, { searching, showAll: showAllLanguages })
      .filter((c) => !isPickedOut(c.id))
      // The merged card is starred under either spelling, so it leaves the
      // list whenever the favourites section is the one drawing it.
      .filter((c) => !(mergedEnglish && c.id === "english-uk" && groupFavourites && englishStarred))
  );
  const hiddenLanguageCount = languages.length - visibleLanguageRows(languages, { searching, showAll: showAllLanguages }).length;
  const programming = inNameOrder(visibleCourses.filter((c) => c.kind === "programming" && !isPickedOut(c.id)));
  const citizenship = inNameOrder(visibleCourses.filter((c) => c.kind === "citizenship" && !isPickedOut(c.id)));

  /**
   * In the order they were starred, so the section does not reshuffle.
   *
   * Scoped, because the dialog is not always showing the whole catalogue.
   * Favourites are one list across everything, and unscoped they put a
   * starred language at the top of the country picker — a language row in
   * a dialog for choosing a country, one click from changing the wrong
   * thing. The starring itself stays global: a course is a favourite
   * wherever it appears, it simply does not appear where it does not
   * belong.
   */
  const favouriteCourses = groupFavourites
    ? favourites
        .filter((id) => !(mergedEnglish && (id === "english-uk" || id === "english-us")))
        .map((id) => visibleCourses.find((c) => c.id === id))
        .filter((c): c is (typeof COURSES)[number] => Boolean(c))
    : [];
  const favouriteRowCount = favouriteCourses.length + (groupFavourites && englishStarred ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 120);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  /**
   * A span with a button role rather than a button: the card around it is
   * already one, and a button inside a button is invalid markup that screen
   * readers flatten. The sidebar's pressable flag is built the same way.
   */
  /**
   * Give a language back from where you chose it.
   *
   * Only on the courses that HAVE a download — which today is at most two, so
   * the picker stays a list of things to learn rather than a list of things
   * to manage. A Remove on every row would be noise on rows with nothing to
   * remove, and a "manage downloads" button somewhere else means leaving the
   * picker in the middle of choosing.
   *
   * Armed like the deletes in Data and storage: one press asks, the second
   * does it. Nothing is lost for good — opening the course fetches it again —
   * but a stray click beside the course you were about to pick should not
   * quietly throw away a download either.
   */
  const DownloadedBadge = ({ id }: { id: string }) => {
    const pack = installedPacks.find((entry) => entry.course === id);
    if (!pack) return null;
    const asking = removing === id;
    const label = asking ? ui("Tap again to remove") : ui("Downloaded — remove");
    const drop = () => {
      if (!asking) { setRemoving(id); return; }
      setRemoving(null);
      void removePack(pack.url).then(() => {
        setInstalledPacks((current) => current.filter((entry) => entry.course !== id));
      });
    };
    return (
      <span
        aria-label={label}
        className={cn(
          "grid shrink-0 place-items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-wide transition-colors",
          asking
            ? "bg-[var(--surface-3)] text-[var(--text-1)]"
            : "bg-[var(--surface-3)] text-[var(--text-3)] hover:text-[var(--text-1)]"
        )}
        onClick={(event) => { event.stopPropagation(); drop(); }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          drop();
        }}
        role="button"
        tabIndex={0}
        title={label}
      >
        {asking ? ui("Remove?") : ui("Downloaded")}
      </span>
    );
  };

  const FavouriteStar = ({ id }: { id: string }) => {
    const on = isFavourite(id);
    const label = on ? ui("Remove from favourites") : ui("Add to favourites");
    return (
      <span
        aria-label={label}
        aria-pressed={on}
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
          on ? "text-[var(--np-yellow,#f0b429)]" : "text-[var(--text-3)] hover:text-[var(--text-1)]"
        )}
        onClick={(event) => { event.stopPropagation(); star(id); }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          star(id);
        }}
        role="button"
        tabIndex={0}
        title={label}
      >
        <Star className={cn("h-4 w-4", on && "fill-current")} />
      </span>
    );
  };

  const Card = ({ id, name, tagline, available, builtIn }: (typeof COURSES)[number]) => {
    const active = id === activeCourseId || id === activeCountryCourseId;
    return (
      <button
        type="button"
        disabled={!available}
        onClick={() => { if (available) { onSelect(id); onClose(); } }}
        className={cn(
          "relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
          active
            ? "border-[var(--accent)] bg-[var(--accent-dim)]"
            : available
              ? "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
              : "border-[var(--border)] bg-[var(--surface-2)] opacity-55"
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl font-black text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--border)]">
          <CourseArtwork id={id} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-black text-[var(--text-1)]">{ui(name)}</span>
            {builtIn && (
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("Built-in")}
              </span>
            )}
            <DownloadedBadge id={id} />
          </span>
          <span className="mt-1 block text-[13px] font-bold leading-5 text-[var(--text-3)]">{ui(tagline)}</span>
        </span>
        {available && <FavouriteStar id={id} />}
        {active ? (
          <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        ) : !available ? (
          <Lock className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
        ) : null}
      </button>
    );
  };

  /**
   * English, once, with the two spellings side by side.
   *
   * These were two rows in the list — "English (UK)" and "English (US)" —
   * which read as two languages to learn and made switching between them a
   * hunt down the list. They are not two courses: selectCourse already treats
   * them as one, setting the same learn-en direction and only differing in
   * which spelling and accent it stores. So the picker now says that too, and
   * the two variants sit next to each other where swapping is one tap.
   *
   * It still calls onSelect with the real course id, so nothing downstream
   * has to know this row is a merge.
   */
  const EnglishCard = ({ uk, us }: { uk: (typeof COURSES)[number]; us: (typeof COURSES)[number] }) => {
    const activeVariant = activeCourseId === uk.id ? "uk" : activeCourseId === us.id ? "us" : null;
    const variants = [
      { key: "uk" as const, course: uk, label: "UK", detail: "colour, practise" },
      { key: "us" as const, course: us, label: "US", detail: "color, practice" },
    ];
    return (
      <div
        className={cn(
          "rounded-2xl border p-4 transition-all",
          activeVariant
            ? "border-[var(--accent)] bg-[var(--accent-dim)]"
            : "border-[var(--border)] bg-[var(--surface-2)]"
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--border)]">
            <CourseArtwork id={uk.id} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="text-sm font-black text-[var(--text-1)]">{ui("English")}</span>
              <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[var(--text-3)]">
                {ui("Built-in")}
              </span>
            </span>
            <span className="mt-1 block text-[13px] font-bold leading-5 text-[var(--text-3)]">
              {ui("Same course, two spellings and accents. Pick one — you can swap any time.")}
            </span>
          </span>
          <FavouriteStar id={uk.id} />
          {activeVariant && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {variants.map((variant) => {
            const selected = activeVariant === variant.key;
            return (
              <button
                key={variant.key}
                type="button"
                aria-pressed={selected}
                onClick={() => { onSelect(variant.course.id); onClose(); }}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                  selected
                    ? "border-[var(--accent)] bg-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-2)] hover:bg-[var(--surface-3)]"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <CourseArtwork id={variant.course.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-black text-[var(--text-1)]">{variant.label}</span>
                  <span className="block truncate text-[11px] font-bold text-[var(--text-3)]">{ui(variant.detail)}</span>
                </span>
                {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 px-4 pt-[88px] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[min(78vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_28px_80px_var(--shadow-strong)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-1)]">{ui("Switch course")}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--text-3)]">
                  {ui(countryOnly
                    ? "Pick the country whose history and society you want to study."
                    : "Pick a language or a programming track.")}
                </p>
              </div>
              <button
                type="button"
                aria-label={ui("Close")}
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="relative mt-5 block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]" />
              <input
                aria-label={ui("Search courses")}
                className="course-switcher-search h-12 w-full appearance-none rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-2)] pl-11 pr-11 text-sm font-bold text-[var(--text-1)] transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)] focus:bg-[var(--surface)] outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui("Search languages or courses…")}
                ref={searchInputRef}
                type="search"
                value={query}
              />
              {query && (
                <button
                  aria-label={ui("Clear search")}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[var(--text-3)] hover:bg-[var(--surface-3)] hover:text-[var(--text-1)]"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="-mr-2 mt-1 min-h-0 flex-1 overflow-y-auto pr-2">
              {favouriteRowCount > 0 && (
                <>
                  {/* The heading is the switch, like the sidebar's sections.
                      The count stays visible while it is shut, so the section
                      still says what is in it. */}
                  <button
                    aria-expanded={favouritesOpen}
                    className="mt-4 flex w-full items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
                    onClick={toggleFavourites}
                    type="button"
                  >
                    {ui("Favourites")}
                    <span className="font-bold normal-case tracking-normal opacity-70">
                      {favouriteRowCount}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn("h-3.5 w-3.5 transition-transform", !favouritesOpen && "-rotate-90")}
                    />
                  </button>
                  {favouritesOpen && (
                    <div className="mt-2 grid gap-2">
                      {englishStarred && mergedEnglish && <EnglishCard uk={mergedEnglish.uk} us={mergedEnglish.us} />}
                      {favouriteCourses.map((c) => <Card key={c.id} {...c} />)}
                    </div>
                  )}
                </>
              )}

              {!countryOnly && languageRowCount > 0 && (
                <>
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">
                    {ui("Languages")}
                    <span className="ml-2 font-bold normal-case tracking-normal opacity-70">
                      {languageRowCount}
                    </span>
                  </p>
                  <div className="mt-2 grid gap-2">
                    {/* English used to sit pinned at the top as the likeliest
                        pick. In a sorted list that reads as the one row out of
                        order, so it takes its place under its own name and the
                        merged card is drawn where english-uk lands. */}
                    {shownLanguages.map((c) => (
                      mergedEnglish && c.id === "english-uk"
                        ? <EnglishCard key={c.id} uk={mergedEnglish.uk} us={mergedEnglish.us} />
                        : <Card key={c.id} {...c} />
                    ))}
                  </div>
                  {hiddenLanguageCount > 0 && (
                    <button
                      className="mt-2 w-full rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-4 py-3 text-sm font-black text-[var(--text-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]"
                      onClick={() => setShowAllLanguages(true)}
                      type="button"
                    >
                      {uiFmt("Show {n} more languages", { n: hiddenLanguageCount })}
                    </button>
                  )}
                </>
              )}

              {!countryOnly && programming.length > 0 && (
                <>
                  <p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Programming")}</p>
                  <div className="mt-2 grid gap-2">
                    {programming.map((c) => <Card key={c.id} {...c} />)}
                  </div>
                </>
              )}

              {citizenship.length > 0 && (
                <>
                  {/* Not "Living in the UK": this section lists every country
                      course, and there are two of them. Country studies is the
                      name the rest of the app already uses for this area — the
                      home card, the sidebar group, the settings heading — so
                      reusing it keeps one name for one thing rather than
                      inventing a second. */}
                  <p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--text-3)]">{ui("Country studies")}</p>
                  <div className="mt-2 grid gap-2">
                    {citizenship.map((c) => <Card key={c.id} {...c} />)}
                  </div>
                </>
              )}

              {(countryOnly ? citizenship.length + favouriteRowCount === 0 : visibleCourses.length === 0) && (
                <div className="mt-5 rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface-2)] px-5 py-8 text-center">
                  <p className="text-sm font-black text-[var(--text-1)]">{ui("No matching course")}</p>
                  <p className="mt-1 text-[13px] font-bold text-[var(--text-3)]">
                    {ui("Search by name, language code, or the name in that language — Deutsch, español, 日本語.")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
