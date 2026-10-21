"use client";

import { CircleAlertIcon, LocateFixedIcon, MapPinIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import type { MapFailure, MapView } from "./hanoi-map";
import { STREET_ZOOM, TASCO_MALL } from "./map-style";

const HanoiMap = dynamic(() => import("./hanoi-map"), {
  ssr: false,
  loading: () => <Skeleton shape="frame" />,
});

export type Point = { latitude: number; longitude: number };

/** How long the browser may look for the place. */
const LOCATION_TIMEOUT_MS = 10_000;

/** What the pin stands on: being looked up, a street, or nothing the geocoder knows. */
type Place = { state: "looking" } | { state: "named"; address: string } | { state: "unnamed" };

/**
 * The map to pin a store on (SEC-66, design decision 2): the pin stays in the middle and the person moves the map
 * under it, as Grab, Shopee and Skip do; the street under the pin shows above it, and "Xác nhận vị trí" waits for a
 * street-level zoom, as talabat does. Full screen on a phone, a dialog on a wider screen.
 */
export function LocationPicker({
  open,
  onOpenChange,
  start,
  describe,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where the pin starts: the store's point, or where the person stands; Tasco Mall when neither is known. */
  start?: Point;
  /** Names the place at a point; empty when nothing is known there. */
  describe: (point: Point) => Promise<string>;
  onConfirm: (point: Point) => void;
}) {
  const t = useTranslations("StoreLocation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent layout="fullscreen">
        <div className="px-4 pt-4 pr-12 pb-3">
          <DialogHeader>
            <DialogTitle size="headline">{t("pickTitle")}</DialogTitle>
            <DialogDescription>{t("pickHint")}</DialogDescription>
          </DialogHeader>
        </div>
        {/* Opened afresh each time, so the map starts where the store is now. */}
        {open && (
          <PickerBody
            start={start}
            describe={describe}
            onConfirm={(point) => {
              onConfirm(point);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PickerBody({
  start,
  describe,
  onConfirm,
}: {
  start?: Point;
  describe: (point: Point) => Promise<string>;
  onConfirm: (point: Point) => void;
}) {
  const t = useTranslations("StoreLocation");
  const mapRef = useRef<MapRef>(null);
  const [view, setView] = useState<MapView>(() => ({
    ...(start ?? TASCO_MALL),
    zoom: start ? STREET_ZOOM + 1 : STREET_ZOOM - 1,
  }));
  const [place, setPlace] = useState<Place>({ state: "looking" });
  const [failure, setFailure] = useState<MapFailure>();
  const [locating, setLocating] = useState(false);
  const [locateFailure, setLocateFailure] = useState<"denied" | "failed">();
  const asked = useRef(0);

  // The street under the pin, asked once the map rests; an answer to an older resting place is dropped.
  useEffect(() => {
    const ask = ++asked.current;
    const point = { latitude: view.latitude, longitude: view.longitude };
    const wait = setTimeout(() => {
      setPlace({ state: "looking" });
      describe(point).then(
        (address) => {
          if (ask === asked.current)
            setPlace(address ? { state: "named", address } : { state: "unnamed" });
        },
        () => {
          if (ask === asked.current) setPlace({ state: "unnamed" });
        },
      );
    }, 400);
    return () => clearTimeout(wait);
  }, [describe, view.latitude, view.longitude]);

  function locate() {
    setLocateFailure(undefined);
    if (!("geolocation" in navigator)) {
      setLocateFailure("failed");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        mapRef.current?.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: STREET_ZOOM + 1,
        });
      },
      (error) => {
        setLocating(false);
        setLocateFailure(error.code === error.PERMISSION_DENIED ? "denied" : "failed");
      },
      { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS, maximumAge: 0 },
    );
  }

  const close = view.zoom >= STREET_ZOOM;

  return (
    <>
      <div className="relative min-h-0 flex-1 bg-muted">
        {failure === "unavailable" ? (
          <Alert variant="destructive" className="m-4 w-auto">
            <CircleAlertIcon aria-hidden />
            <AlertDescription>{t("unavailable")}</AlertDescription>
          </Alert>
        ) : (
          <>
            <HanoiMap
              view={view}
              label={t("mapLabel")}
              mapRef={mapRef}
              onMoveEnd={setView}
              onFailure={(f) => setFailure((now) => (now === "unavailable" ? now : f))}
            />
            {/* The pin's tip is the map's middle; it takes no touch, so the map moves under it. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex -translate-y-1/2 flex-col items-center gap-1">
                <output
                  aria-live="polite"
                  className="max-w-64 truncate rounded-full bg-foreground px-3 py-1 text-note text-background shadow-md"
                >
                  {place.state === "looking"
                    ? t("looking")
                    : place.state === "named"
                      ? place.address
                      : t("unnamed")}
                </output>
                <MapPinIcon aria-hidden className="size-10 fill-primary text-primary-foreground" />
              </div>
            </div>
            <Button
              type="button"
              variant="float"
              size="icon-lg"
              className="absolute top-4 right-4"
              aria-label={t("locate")}
              title={t("locate")}
              disabled={locating}
              onClick={locate}
            >
              {locating ? <Spinner /> : <LocateFixedIcon aria-hidden />}
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-border p-4">
        {failure === "tiles" && (
          <p className="text-note text-warning-foreground">{t("tilesFailed")}</p>
        )}
        {locateFailure && (
          <p className="text-note text-warning-foreground">
            {t(locateFailure === "denied" ? "locateDenied" : "locateFailed")}
          </p>
        )}
        {!close && failure !== "unavailable" && (
          <p id="pin-zoom-hint" className="text-note text-muted-foreground">
            {t("zoomIn")}
          </p>
        )}
        <Button
          type="button"
          size="lg"
          disabled={!close || failure === "unavailable"}
          aria-describedby={close ? undefined : "pin-zoom-hint"}
          onClick={() => onConfirm({ latitude: view.latitude, longitude: view.longitude })}
        >
          {t("confirm")}
        </Button>
      </div>
    </>
  );
}
