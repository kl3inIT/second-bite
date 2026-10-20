import { readReviewQuery } from "./review";
import { ReviewsList } from "./reviews-list";
import { listAdminReviews } from "./reviews-source";

/** The reviews for the address's tab and filters (Figma AD-DG1). It reads the request, so it renders in Suspense. */
export async function ReviewsPage({
  query: pendingQuery,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readReviewQuery(await pendingQuery);
  const list = await listAdminReviews(query);
  return (
    <ReviewsList
      query={query}
      rows={list.items}
      total={list.total}
      counts={list.counts}
      sellers={list.sellers}
    />
  );
}
