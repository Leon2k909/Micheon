import type { PortablePetBundle } from "@/lib/dataTransfer";

/** Read the user-managed pet files from the local Micheon server. */
export async function collectPortablePetBundles(): Promise<PortablePetBundle[]> {
  const response = await fetch("/api/codex-pets/transfer", { cache: "no-store" });
  if (!response.ok) throw new Error(`Pet export returned ${response.status}`);
  const payload = await response.json() as { pets?: PortablePetBundle[] };
  return Array.isArray(payload.pets) ? payload.pets : [];
}

/** Restore user-managed bundles without deleting pets that are already here. */
export async function importPortablePetBundles(pets: PortablePetBundle[]): Promise<void> {
  if (!pets.length) return;
  const response = await fetch("/api/codex-pets/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pets }),
  });
  if (!response.ok) throw new Error(`Pet import returned ${response.status}`);
}
