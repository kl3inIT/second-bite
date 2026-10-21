/** A province or centrally run city, by its official code, for the "Khu vực" filter. */
export type Province = { code: number; name: string };

/**
 * Vietnam's 34 provinces and centrally run cities since 1 July 2025, from provinces.open-api.vn's API v2,
 * read on the server and kept a day. The filter offers them before a seller has a province (SEC-66, the
 * seller's side); until then the list does not filter by it. Without an answer in 3 seconds the filter
 * offers only "Tất cả", and the page still opens.
 */
export async function loadProvinces(): Promise<Province[]> {
  try {
    const response = await fetch("https://provinces.open-api.vn/api/v2/p/", {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 86400 },
    });
    if (!response.ok) return [];
    const provinces = (await response.json()) as Array<{ code: number; name: string }>;
    return provinces.map(({ code, name }) => ({ code, name }));
  } catch {
    return [];
  }
}
