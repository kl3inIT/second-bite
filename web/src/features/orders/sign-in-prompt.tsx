import { ReceiptTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// What an order screen shows someone signed out: orders belong to an account, so sign in, then come back here.
export function SignInPrompt({ returnTo }: { returnTo: string }) {
  const t = useTranslations("Orders");

  return (
    <section
      aria-labelledby="orders-sign-in"
      className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center text-card-foreground"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <ReceiptTextIcon aria-hidden className="size-6" />
      </span>
      <h2 id="orders-sign-in" className="text-title">
        {t("signInTitle")}
      </h2>
      <p className="text-body-sm text-muted-foreground">{t("signInBody")}</p>
      <Link
        href={{ pathname: "/sign-in", query: { returnTo } }}
        className={buttonVariants({ size: "lg" })}
      >
        {t("signIn")}
      </Link>
    </section>
  );
}
