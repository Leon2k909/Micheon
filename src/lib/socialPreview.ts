export const LEON_SOCIAL_PREVIEW_EMAIL = "leon@ordifydirect.com";

export function hasLeonSocialPreview(email: string | null | undefined) {
  return String(email ?? "").trim().toLocaleLowerCase("en-GB") === LEON_SOCIAL_PREVIEW_EMAIL;
}
