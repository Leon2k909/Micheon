import { hasFlagArt } from "@/components/course/FlagRoundel";
import { learningEnglish } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";

/**
 * Which flag stands for the language being LEARNED.
 *
 * Not the course id, which is the trap here. German and English are one body
 * of material served both ways round: Michelle and Leon both have
 * active-course "german", and the direction is what says she is learning
 * English and he is learning German. Reading the course id alone gives them
 * the same flag, and it is the wrong one for one of them — Leon, on the
 * sidebar heading: "bei leon ist hier nicht die flagge für die sprache die er
 * ausgewählt hat ... da soll immer die flagge von dem land sein was gelernt
 * wird."
 *
 * So the reversible pair asks the direction, and picks the variant the learner
 * chose while it is there, because en-GB and en-US are different flags. Any
 * other language course is a language in its own right and names itself.
 * Anything that is not a language at all — the citizenship course, the
 * programming course — falls back to the direction rather than to the globe
 * that FlagRoundel draws for an id it has no art for.
 */
export function learningFlagId(activeCourseId: string): string {
  const reversiblePair = activeCourseId === "german" || activeCourseId.startsWith("english-");
  if (reversiblePair || !hasFlagArt(activeCourseId)) {
    if (!learningEnglish()) return "german";
    return resolveEnglishVariant(getEnglishVariant()) === "american" ? "english-us" : "english-uk";
  }
  return activeCourseId;
}
