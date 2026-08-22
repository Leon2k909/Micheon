/**
 * Who gets the features that are not public yet.
 *
 * This was a single email, because for a while there was a single person
 * using them. It is a list now, because both accounts get the same features,
 * and the honest way to do that is to add to the gate rather than to
 * remove it. What is behind it — games, the reward shop, the social
 * preview — is still unfinished, and the app still says so on the cards.
 *
 * Matching stays exact after trimming and lower-casing. No domain rules and
 * no plus-address handling: "leon+friends@ordifydirect.com" is a different
 * address and does not get in.
 */
export const LEON_SOCIAL_PREVIEW_EMAIL = "leon@ordifydirect.com";
export const MICHELLE_SOCIAL_PREVIEW_EMAIL = "sozialmichelle@gmail.com";

export const SOCIAL_PREVIEW_EMAILS = [
  LEON_SOCIAL_PREVIEW_EMAIL,
  MICHELLE_SOCIAL_PREVIEW_EMAIL,
] as const;

function normaliseEmail(email: string | null | undefined): string {
  return String(email ?? "").trim().toLocaleLowerCase("en-GB");
}

export function hasLeonSocialPreview(email: string | null | undefined) {
  const normalised = normaliseEmail(email);
  return SOCIAL_PREVIEW_EMAILS.some((allowed) => allowed === normalised);
}
