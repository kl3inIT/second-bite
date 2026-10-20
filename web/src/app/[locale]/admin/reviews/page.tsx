import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { ReviewsPage } from "@/features/admin/reviews/reviews-page";

export function generateMetadata({ params }: PageProps<"/[locale]/admin/reviews">) {
  return adminMetadata(params, "reviews");
}

// The customers' reviews (SEC-62, Figma AD-DG1 to AD-DG3), empty until a module keeps reviews.
export default function AdminReviews({ searchParams }: PageProps<"/[locale]/admin/reviews">) {
  return (
    <AdminPageGate page="reviews">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <ReviewsPage query={searchParams} />
      </Suspense>
    </AdminPageGate>
  );
}
