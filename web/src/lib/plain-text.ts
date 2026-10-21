/** Lower case without accents, so "Bánh" is found by "banh" and "Đạt" by "dat". */
export function plainText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "d")
    .toLowerCase();
}
