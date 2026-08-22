import { hasFlagArt } from "@/components/course/FlagRoundel";
import { learningEnglish } from "@/lib/direction";
import { getEnglishVariant, resolveEnglishVariant } from "@/lib/englishVariant";

/**
 * Which flag stands for the language being LEARNED.
 *
 * Not the course id, which is the trap here. German and English are one body
 * of material served both ways round: two profiles can both have
 * active-course "german" while one is learning English and the other German,
 * and the DIRECTION is what says which. Reading the course id alone gives them
 * the same flag, and it is the wrong one for one of them: a sidebar heading
 * showed a globe instead of the flag of the language being learned. The flag
 * must always be the country of the language being learned.
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
