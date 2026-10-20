import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageGate, adminMetadata } from "@/features/admin/admin-page";
import { BannerPage } from "@/features/admin/content/content-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/admin/content/banners/[bannerId]">) {
  const [{ bannerId }, t] = await Promise.all([params, getTranslations("admin.content.editor")]);
  return adminMetadata(params, { title: bannerId === "new" ? t("newTitle") : t("editTitle") });
}

// Adding or changing a banner (SEC-62, Figma AD-MK4). It cannot be saved until a backend keeps banners.
export default function AdminBanner({
  params,
}: PageProps<"/[locale]/admin/content/banners/[bannerId]">) {
  return (
    <AdminPageGate page="bannerDetail">
      <Suspense fallback={<Skeleton shape="card" className="h-96" />}>
        <BannerPage bannerId={params.then((p) => p.bannerId)} />
      </Suspense>
    </AdminPageGate>
  );
}
