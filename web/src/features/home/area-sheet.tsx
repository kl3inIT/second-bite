"use client";

import { LocateFixedIcon, StoreIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ChoiceOption } from "@/components/choice-option";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { RadioGroup } from "@/components/ui/radio-group";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Area = "mall" | "nearby";

// Three decimals of a degree, about 110 m: enough for "350 m" on a card, without the exact spot in the address.
const POINT_DECIMALS = 3;
const LOCATION_TIMEOUT_MS = 10_000;
const LOCATION_MAX_AGE_MS = 5 * 60_000;

// Where to look for dishes (Figma K1a "Xem món ở đâu?"): Tasco Mall, the default, or the person's own place,
// which the browser asks permission for itself (K1c is the phone's own prompt). The choice becomes `near` in
// the address, beside the filters in `keep`; the whole place on the header opens it.
export function AreaSheet({
  nearby,
  keep,
  className,
}: {
  nearby: boolean;
  keep: Record<string, string>;
  className?: string;
}) {
  const t = useTranslations("Area");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<Area>(nearby ? "nearby" : "mall");
  const [locating, setLocating] = useState(false);
  const [failure, setFailure] = useState<"denied" | "failed">();

  function show(query: Record<string, string>) {
    router.push({ pathname: "/", query });
    setOpen(false);
  }

  function apply() {
    setFailure(undefined);
    if (area === "mall") {
      show(keep);
      return;
    }
    if (!("geolocation" in navigator)) {
      setFailure("failed");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const near = `${coords.latitude.toFixed(POINT_DECIMALS)},${coords.longitude.toFixed(POINT_DECIMALS)}`;
        show({ ...keep, near });
      },
      (error) => {
        setLocating(false);
        setFailure(error.code === error.PERMISSION_DENIED ? "denied" : "failed");
      },
      { timeout: LOCATION_TIMEOUT_MS, maximumAge: LOCATION_MAX_AGE_MS },
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* A plain button opens it, so the place's own shape and focus ring stay with the header. */}
      <button
        type="button"
        aria-label={t("open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-lg focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none",
          className,
        )}
      />
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
              <XIcon aria-hidden className="size-5" />
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>
          <RadioGroup
            value={area}
            onValueChange={(value) => setArea(value as Area)}
            aria-label={t("title")}
          >
            <ChoiceOption value="mall" icon={StoreIcon} title={t("mall")} hint={t("mallHint")} />
            <ChoiceOption
              value="nearby"
              icon={LocateFixedIcon}
              title={t("nearby")}
              hint={t("nearbyHint")}
            />
          </RadioGroup>
          {failure && (
            <p role="alert" className="text-body-sm text-destructive">
              {t(failure)}
            </p>
          )}
          <Button size="lg" onClick={apply} disabled={locating}>
            {locating ? t("locating") : t("apply")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
