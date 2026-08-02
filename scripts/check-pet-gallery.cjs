const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const gallery = fs.readFileSync(
  path.join(root, "src/components/codexPets/PetGallery.tsx"),
  "utf8"
);
const picker = fs.readFileSync(
  path.join(root, "src/components/codexPets/CodexPetPicker.tsx"),
  "utf8"
);
const gamification = fs.readFileSync(path.join(root, "src/Gamification.tsx"), "utf8");
const server = fs.readFileSync(path.join(root, "server/petGallery.js"), "utf8");
const petServer = fs.readFileSync(path.join(root, "server/codexPets.js"), "utf8");
const serverRoutes = fs.readFileSync(path.join(root, "server/index.js"), "utf8");
const profileStart = gamification.indexOf("if (profileOnly)");
const profileEnd = gamification.indexOf("\n  return (", profileStart);
const profile = gamification.slice(profileStart, profileEnd);

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

check(
  "the gallery owns exactly one initial page-one load",
  (gallery.match(/void load\(1, query, "replace"\)/g) ?? []).length === 1
    && !gallery.includes('void load(1, "")')
);
check(
  "search is debounced into the committed query without fetching from the debounce effect",
  gallery.includes("setQuery(search.trim())")
    && gallery.includes("}, [search]);")
);
check(
  "stale gallery requests are aborted and generation guarded",
  gallery.includes("requestRef.current?.abort()")
    && gallery.includes("new AbortController()")
    && gallery.includes("generation !== requestGenerationRef.current")
);
check(
  "later pages append by id without replacing or duplicating earlier pets",
  gallery.includes("function appendUniquePets")
    && gallery.includes("if (seen.has(pet.id)) return;")
    && gallery.includes("seen.add(pet.id);")
    && gallery.includes('mode === "more" ? appendUniquePets(current, incoming) : incoming')
);
check(
  "infinite loading observes a bounded keyboard-scrollable gallery root",
  gallery.includes("new IntersectionObserver(")
    && gallery.includes('{ root, rootMargin: "180px 0px", threshold: 0.01 }')
    && gallery.includes("h-[min(34rem,65vh)]")
    && gallery.includes("overflow-y-auto")
    && gallery.includes("tabIndex={0}")
);
check(
  "automatic retries stop after a load-more failure and a manual retry remains",
  gallery.includes("!hasMore || loadState !== null || moreError")
    && gallery.includes("if (!root || !target || !hasMore || loadState !== null || moreError)")
    && gallery.includes('ui("Could not load more pets.")')
    && gallery.includes('ui("Try again")')
);
check(
  "loading, empty, error and end states are distinct",
  gallery.includes("initialLoading")
    && gallery.includes("loadingMore")
    && gallery.includes('ui("No pets found.")')
    && gallery.includes('ui("You\'ve reached the end.")')
);
check(
  "refresh restarts at page one while keeping the current list until success",
  gallery.includes('onClick={() => void load(1, query, "refresh")}')
    && gallery.includes('mode === "replace"')
);
check(
  "manual Back and Next pagination is gone",
  !gallery.includes('ui("Back")') && !gallery.includes('ui("Next")')
);
check(
  "the server page cap and advertised end remain consistent",
  server.includes("const MAX_GALLERY_PAGE = 200;")
    && server.includes("Math.min(MAX_GALLERY_PAGE, Number(payload?.totalPages) || 1)")
);
check(
  "the local search parameter is translated to the upstream q parameter",
  server.includes('if (search) url.searchParams.set("q", String(search).slice(0, 80));')
    && !server.includes('url.searchParams.set("search"')
);
check(
  "user-managed Codex and Micheon pets have an explicit confirmed deletion flow",
  picker.includes('pet.source === "custom" || pet.source === "micheon-custom"')
    && picker.includes('method: "DELETE"')
    && picker.includes('/api/codex-pets/${encodeURIComponent(candidate.source)}')
    && picker.includes('role="dialog"')
    && picker.includes('aria-modal="true"')
    && picker.includes('ui("Delete pet?")')
    && picker.includes('await refresh()')
    && picker.includes('setGalleryRevision((revision) => revision + 1)')
);
check(
  "the server removes only a catalogued direct child of a user pets folder",
  petServer.includes("export function removeUserManagedPet")
    && petServer.includes('source !== "custom" && source !== "micheon-custom"')
    && petServer.includes("path.dirname(target) !== root")
    && petServer.includes("listCodexPets({ fresh: true }).find")
    && serverRoutes.includes('app.delete("/api/codex-pets/:source/:id"')
);
check(
  "profile settings distribute account controls before preferences",
  profile.includes("grid items-start gap-6")
    && profile.indexOf('ui("Appearance")') < profile.indexOf('ui("Preferences")')
    && profile.indexOf('ui("External word count")') < profile.indexOf('ui("Preferences")')
    && profile.indexOf("<LearningModePicker") < profile.indexOf('ui("Preferences")')
);
check(
  "the pet manager spans both profile columns below the balanced settings row",
  /<DeferredProfileSection[\s\S]*?className="lg:col-span-2"[\s\S]*?<CodexPetPicker className="mt-0 border-t-0 pt-0" \/>/.test(profile)
    && profile.includes('<CodexPetPicker className="mt-0 border-t-0 pt-0" />')
    && profile.indexOf('<CodexPetPicker className="mt-0 border-t-0 pt-0" />')
      > profile.indexOf('ui("Preferences")')
);

if (failures) {
  console.error(`\n${failures} pet gallery regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nAJAX pet-gallery infinite scrolling is guarded");
