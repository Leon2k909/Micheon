/**
 * The picture on a friend's row, going out and coming back.
 *
 * The app already lets someone put a photo on their own profile, and it keeps
 * it as a data URL exactly as the file picker handed it over — which is to say
 * whatever came off a phone camera, several megabytes of it. That is fine
 * sitting in one person's own storage and wrong to put on a wire: it would be
 * sent again on every profile refresh, and kept in localStorage on every
 * machine that ever paired with them.
 *
 * So a shared photo is not the profile photo. It is a small square made from
 * it, sized for the 44px circle it will actually be drawn in, and capped hard
 * enough that a friend list cannot grow into the storage quota.
 *
 * Coming back the other way it is not a photo at all until proved otherwise:
 * it arrived from another computer over a channel anything can speak, and it
 * ends up in an <img> tag. What is accepted is a base64 data URL for one of
 * three raster formats, under the cap, and nothing else. SVG is refused by
 * name — it is an image format that can carry script and reference the
 * network, and none of that belongs in a friends list.
 */

/** Drawn at 44px, so 128 covers a retina screen with nothing to spare. */
export const SHARED_PHOTO_SIZE = 128;

/**
 * The ceiling on an encoded photo, in characters of data URL.
 *
 * 32KB is roughly five times what a 128px JPEG needs, which leaves room for an
 * awkward image without leaving room for someone to fill a friend's disk: a
 * hundred friends at the cap is 3MB, inside a 5MB localStorage budget that
 * also holds real progress.
 */
export const SHARED_PHOTO_MAX = 32_768;

/** The only things that may be drawn. Raster, base64, and not SVG. */
const SHARED_PHOTO_PATTERN = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

/**
 * A photo that arrived from someone else, or nothing.
 *
 * Deliberately total: every rejection returns undefined rather than throwing,
 * because a friend whose photo is unusable should still appear in the list
 * with their initials, exactly as they did before photos existed.
 */
export function safeSharedPhoto(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (!text || text.length > SHARED_PHOTO_MAX) return undefined;
  if (!SHARED_PHOTO_PATTERN.test(text)) return undefined;
  return text;
}

/**
 * The small square that gets sent, made from the full-size profile photo.
 *
 * Cropped to a centred square first rather than squashed, because the circle
 * it lands in would squash it again. Encoded as JPEG: a photograph at this
 * size is several times smaller than the PNG a phone hands over, and the one
 * thing JPEG is bad at — hard edges — is not what a face is made of.
 *
 * Returns undefined rather than throwing on anything unexpected, so a profile
 * still sends when its photo will not load.
 */
export async function shrinkPhotoForSharing(
  photo: string | undefined,
  quality = 0.72
): Promise<string | undefined> {
  if (!photo || typeof photo !== "string") return undefined;
  if (typeof document === "undefined" || typeof Image === "undefined") return undefined;
  // Already small enough and already in an accepted shape: send it unchanged
  // rather than re-encoding a picture that has been through this once.
  const asIs = safeSharedPhoto(photo);
  if (asIs) return asIs;
  try {
    const image = await loadImage(photo);
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    if (!side) return undefined;
    const canvas = document.createElement("canvas");
    canvas.width = SHARED_PHOTO_SIZE;
    canvas.height = SHARED_PHOTO_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      SHARED_PHOTO_SIZE,
      SHARED_PHOTO_SIZE
    );
    const encoded = canvas.toDataURL("image/jpeg", quality);
    return safeSharedPhoto(encoded);
  } catch {
    return undefined;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("photo did not load"));
    image.src = src;
  });
}
