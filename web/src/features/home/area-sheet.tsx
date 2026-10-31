"use client";

import {
  ChevronRightIcon,
  CircleAlertIcon,
  LocateFixedIcon,
  MapPinIcon,
  SearchIcon,
  StoreIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { ChoiceOption } from "@/components/choice-option";
import { TASCO_MALL } from "@/components/map/map-style";
import { usePlaceSuggestions } from "@/components/map/use-place-suggestions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/navigation";
import { searchCustomerPlaces, type PlaceBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import { homePath, type HomeQuery } from "./home-query";
import { rememberPlace } from "./remember-place";

type Area = "all" | "mall";

// Three decimals of a degree, about 110 m: enough for "350 m" on a card, without the exact spot in the address.
const POINT_DECIMALS = 3;
const LOCATION_TIMEOUT_MS = 10_000;
const LOCATION_MAX_AGE_MS = 5 * 60_000;

/** A point as `near` takes it. */
function nearOf(latitude: number, longitude: number): string {
  return `${latitude.toFixed(POINT_DECIMALS)},${longitude.toFixed(POINT_DECIMALS)}`;
}

const MALL_NEAR = nearOf(TASCO_MALL.latitude, TASCO_MALL.longitude);

/** A suggested place's name, the first part of its address, over the rest. */
function partsOf(place: PlaceBody): { name: string; rest: string } {
  const [name = place.address, ...rest] = place.address.split(",").map((part) => part.trim());
  return { name, rest: rest.join(", ") };
}

// Where to look for dishes (Figma K1a "Xem món ở đâu?", redrawn for the customer place increment): a place typed,
// its suggestions chosen with one tap; "Gần tôi", which only then asks the browser for the person's place (K1c is the
// phone's own prompt), as web.dev and Apple ask; then every shop, the default, or Tasco Mall as a suggestion. A
// place becomes `near` and `place` in the address, beside the filters in `keep`, and is kept for the next visit
// (`remembered-place.ts`); the whole place on the header opens it.
export function AreaSheet({
  near,
  keep,
  className,
}: {
  near?: string;
  keep: HomeQuery;
  className?: string;
}) {
  const t = useTranslations("Area");
  const router = useRouter();
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<Area | null>(
    near === undefined ? "all" : near === MALL_NEAR ? "mall" : null,
  );
  const [words, setWords] = useState("");
  const [locating, setLocating] = useState(false);
  const [failure, setFailure] = useState<"denied" | "failed">();
  const { places, answered, search, clear } = usePlaceSuggestions((q) =>
    searchCustomerPlaces({ query: { q } }).then(({ data }) => data.places ?? []),
  );

  // The place is kept for the next visit before the page asks for it; every shop forgets it.
  async function show(query: HomeQuery) {
    await rememberPlace(query.near, query.place);
    router.push(homePath(query));
    setOpen(false);
  }

  function choosePlace(place: PlaceBody) {
    void show({
      ...keep,
      near: nearOf(place.latitude, place.longitude),
      place: partsOf(place).name,
    });
  }

  function apply() {
    if (area === "all") void show(keep);
    if (area === "mall") void show({ ...keep, near: MALL_NEAR, place: t("mall") });
  }

  function locate() {
    setFailure(undefined);
    if (!("geolocation" in navigator)) {
      setFailure("failed");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        void show({ ...keep, near: nearOf(coords.latitude, coords.longitude) });
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
        <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 pt-5 pb-6">
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>{t("title")}</DrawerTitle>
            <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
              <XIcon aria-hidden className="size-5" />
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">{t("description")}</DrawerDescription>
          <search className="search-cancel-none">
            <InputGroup className="h-12">
              <InputGroupAddon>
                <SearchIcon aria-hidden className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                id={fieldId}
                type="search"
                value={words}
                onChange={(event) => {
                  setWords(event.target.value);
                  search(event.target.value);
                }}
                aria-label={t("field")}
                placeholder={t("fieldPlaceholder")}
                autoComplete="off"
                enterKeyHint="search"
              />
              {words && (
                <InputGroupAddon align="inline-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("clear")}
                    onClick={() => {
                      setWords("");
                      clear();
                    }}
                  >
                    <XIcon aria-hidden className="size-4" />
                  </Button>
                </InputGroupAddon>
              )}
            </InputGroup>
          </search>
          <output className="sr-only">
            {answered ? t("suggestions", { count: places.length }) : ""}
          </output>
          {places.length > 0 && (
            <ul
              aria-label={t("suggestionsLabel")}
              className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border"
            >
              {places.map((place) => {
                const { name, rest } = partsOf(place);
                return (
                  <li key={`${place.address}-${place.latitude}-${place.longitude}`}>
                    <button
                      type="button"
                      onClick={() => choosePlace(place)}
                      className="flex min-h-14 w-full items-start gap-3 bg-card px-3.5 py-2.5 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                    >
                      <MapPinIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-body-sm-strong text-foreground">{name}</span>
                        {rest && <span className="text-label text-muted-foreground">{rest}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {answered && places.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3.5 py-3 text-body-sm text-muted-foreground">
              {t("noPlace")}
            </p>
          )}
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 text-left transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-progress"
          >
            <LocateFixedIcon aria-hidden className="size-5 shrink-0 text-primary" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-sm-strong text-foreground">{t("nearby")}</span>
              <span className="text-label text-muted-foreground">
                {locating ? t("locating") : t("nearbyHint")}
              </span>
            </span>
            <ChevronRightIcon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          </button>
          {failure && (
            <Alert variant="warning">
              <CircleAlertIcon aria-hidden />
              <AlertDescription>{t(failure)}</AlertDescription>
            </Alert>
          )}
          <Separator className="my-1" />
          <RadioGroup
            value={area}
            onValueChange={(value) => setArea(value as Area)}
            aria-label={t("areas")}
          >
            <ChoiceOption value="all" icon={StoreIcon} title={t("all")} hint={t("allHint")} />
            <ChoiceOption value="mall" icon={MapPinIcon} title={t("mall")} hint={t("mallHint")} />
          </RadioGroup>
          <Button size="lg" onClick={apply} disabled={area === null}>
            {t("apply")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
