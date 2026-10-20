// How a seller without a logo is drawn (DESIGN.md › Seller avatars): their initials on one of four colours,
// chosen from the seller's id so the same seller always looks the same.

export const avatarTones = ["clay", "rose", "indigo", "olive"] as const;

export type AvatarTone = (typeof avatarTones)[number];

/** The first letter of the first and the last word, as "Lò Bánh Mây" becomes "LM"; one letter for one word. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0]!;
  const last = words.length > 1 ? words[words.length - 1]! : "";
  return (Array.from(first)[0]! + (last ? Array.from(last)[0]! : "")).toLocaleUpperCase("vi");
}

/** A stable colour for a seller, from a small hash of their id. */
export function avatarTone(sellerId: string): AvatarTone {
  let hash = 0;
  for (const char of sellerId) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return avatarTones[hash % avatarTones.length]!;
}
