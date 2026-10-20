import { useTranslations } from "next-intl";

import { AdminBadge } from "./badge";

/**
 * "Sắp có" beside an action whose backend does not exist yet: the form is built in full, its save or send button
 * stays disabled and never pretends to save (SEC-62). The disabled button names this badge with
 * `aria-describedby={id}`.
 */
export function SoonBadge({ id }: { id: string }) {
  const t = useTranslations("admin.shell");
  return (
    <span id={id} className="flex">
      <AdminBadge tone="neutral" icon={null}>
        {t("soon")}
      </AdminBadge>
    </span>
  );
}
