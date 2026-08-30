import { hasFlagArt } from "@/components/course/FlagRoundel";
import { getLearningDirection } from "@/lib/direction";
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
 * So the reversible set asks the direction, and picks the variant the learner
 * chose while it is there, because en-GB and en-US are different flags. Any
 * other language course is a language in its own right and names itself.
 * Anything that is not a language at all — the citizenship course, the
 * programming course — falls back to the direction rather than to the globe
 * that FlagRoundel draws for an id it has no art for.
 *
 * French joined the set for the same reason English did: it is the same
 * material read a third way, so "french" as a course id and learn-fr as a
 * direction are two names for one thing and either may be the one that is
 * right in hand. Polish is there on the same terms.
 */
export function learningFlagId(activeCourseId: string): string {
  const reversible = activeCourseId === "german"
    || activeCourseId === "french"
    || activeCourseId === "polish"
    || activeCourseId === "spanish"
    || activeCourseId === "portuguese"
    || activeCourseId.startsWith("english-");
  if (reversible || !hasFlagArt(activeCourseId)) {
    const direction = getLearningDirection();
    if (direction === "learn-fr") return "french";
    if (direction === "learn-pl") return "polish";
    if (direction === "learn-es") return "spanish";
    if (direction === "learn-pt") return "portuguese";
    if (direction !== "learn-en") return "german";
    return resolveEnglishVariant(getEnglishVariant()) === "american" ? "english-us" : "english-uk";
  }
  return activeCourseId;
}
