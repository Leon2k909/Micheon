const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");

const app = read("src/App.tsx");
const login = read("src/components/LoginScreen.tsx");
const placement = read("src/components/PlacementTest.tsx");
const guided = read("src/guided_learning_session.tsx");
const prototype = read("src/prototype/NewUiPrototype.tsx");
const translations = read("src/lib/i18n.ts");

let failures = 0;
function check(name, condition) {
  if (condition) {
    console.log(`ok   ${name}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${name}`);
}

const accountGate = app.indexOf("{!user || showLogin ? (");
const guidedBranch = app.indexOf(") : guided ? (", accountGate);
const dashboardBranch = app.indexOf("<MicheonMain profile={user}", guidedBranch);

check(
  "signed-out users reach account setup before the dashboard or guided lesson",
  accountGate !== -1 && guidedBranch > accountGate && dashboardBranch > guidedBranch,
);
check(
  "the first-run account screen asks for an email address",
  login.includes('type="email"') && login.includes('ui("Email")') && login.includes("setAuthUser(user)"),
);

const previewStart = prototype.indexOf("const PREVIEW_PROFILE");
const previewEnd = prototype.indexOf("};", previewStart);
const previewProfile = prototype.slice(previewStart, previewEnd);
check(
  "the anonymous UI fallback is not presented as Leon",
  previewStart !== -1 && previewProfile.includes('name: "Learner"') && !previewProfile.includes('name: "Leon"'),
);
check(
  "unplaced profiles see an honest starting-point home action instead of an A2 lesson claim",
  /loadScopedJson(?:<boolean>)?\("german-lab-placement-done", false, profile\) !== true/u.test(prototype)
    && prototype.includes('needsStartingPoint ? "New learner" : `Level ${placementLevel[0]}`')
    && prototype.includes('needsStartingPoint ? "Choose your starting point" : firstLessonReady ? "Start learning" : "Continue learning"'),
);

const choiceStart = placement.indexOf('if (stage === "choice")');
const resultStart = placement.indexOf("if (showResult)");
check(
  "placement opens with an explicit beginner choice before any question UI",
  placement.includes('useState<"choice" | "questions">("choice")')
    && choiceStart !== -1
    && resultStart > choiceStart
    && placement.includes("Are you completely new to German?"),
);
check(
  "total beginners bypass placement and start at the first module",
  placement.includes('onClick={() => onComplete("part1")}')
    && placement.includes("Yes, start from the beginning"),
);
check(
  "learners with prior knowledge can still take the placement questions",
  placement.includes('onClick={() => setStage("questions")}')
    && placement.includes("No, check my level")
    && placement.includes("Answer 10 short questions"),
);
check(
  "either route is persisted as placement complete for the signed-in profile",
  guided.includes('saveScopedJson("german-lab-placement-result", key, user)')
    && guided.includes('saveScopedJson("german-lab-placement-done", true, user)'),
);
check(
  "a total beginner returns to an A1 first-lesson home state",
  prototype.includes('placementPart === "part1" ? ["A1", "Building the basics"]')
    && prototype.includes('firstLessonReady ? "Start learning" : "Continue learning"'),
);
check(
  "the beginner choice is translated for German-speaking English learners",
  translations.includes('"Are you completely new to English?": "Fängst du ganz neu mit Englisch an?"')
    && translations.includes('"Yes, start from the beginning": "Ja, ganz von vorne anfangen"')
    && translations.includes('"No, check my level": "Nein, mein Niveau prüfen"'),
);

if (failures) {
  console.error(`\n${failures} first-run onboarding regression${failures === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\nFresh installs require a profile and offer a beginner-safe lesson start");
