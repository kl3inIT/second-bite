import { listSellersForAdmins } from "@/lib/api/generated";

/**
 * The stores a promotion may run for, by name: the active ones, a hundred at most, which the pilot's thirty fit.
 * Read on the server with the admin's session.
 */
export async function loadStores(
  headers: { cookie: string } | undefined,
): Promise<Array<{ id: string; name: string }>> {
  const { data } = await listSellersForAdmins({
    headers,
    query: { status: ["active"], sort: "name", size: 100 },
  });
  return (data.items ?? []).map((s) => ({ id: s.id, name: s.name }));
}
