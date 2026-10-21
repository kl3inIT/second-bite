"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { MapPinIcon } from "lucide-react";
import { addProtocol } from "maplibre-gl";
import { Protocol } from "pmtiles";
import { useMemo, type Ref } from "react";
import {
  Map,
  Marker,
  type ErrorEvent,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";

import { HANOI_BOUNDS, MAX_ZOOM, MIN_ZOOM, hanoiStyle } from "./map-style";

// The archive is read through the `pmtiles://` protocol, which "must be added once globally" (pmtiles,
// js/src/adapters.ts): at module scope, so two maps on a page or React's double mount never add it twice.
const registered = globalThis as { secondBitePmtiles?: true };
if (!registered.secondBitePmtiles) {
  addProtocol("pmtiles", new Protocol().tile);
  registered.secondBitePmtiles = true;
}

// MapLibre 6 looks for its worker beside its own module, which the bundler renames; Next.js emits this file under
// /_next/static/media/ and gives its address.
const workerUrl = new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href;

export type MapView = { latitude: number; longitude: number; zoom: number };

/** What went wrong: the map could not start (no WebGL), or it started and some of Hanoi did not load. */
export type MapFailure = "unavailable" | "tiles";

/**
 * A map of Hanoi that cannot leave it (SEC-66): the base of the store pickers and of the admin's view of a store.
 * Loaded on the client only, through `next/dynamic`.
 */
export default function HanoiMap({
  view,
  label,
  interactive = true,
  onMoveEnd,
  onFailure,
  mapRef,
  pin,
}: {
  view: MapView;
  /** What the map shows, for a screen reader: MapLibre names its canvas with it ("Map" otherwise). */
  label: string;
  interactive?: boolean;
  onMoveEnd?: (view: MapView) => void;
  onFailure?: (failure: MapFailure) => void;
  mapRef?: Ref<MapRef>;
  /** A pin fixed to a point, for a map that shows where a store is. */
  pin?: { latitude: number; longitude: number };
}) {
  const mapStyle = useMemo(() => hanoiStyle(window.location.origin), []);

  return (
    <Map
      ref={mapRef}
      initialViewState={view}
      mapStyle={mapStyle}
      workerUrl={workerUrl}
      maxBounds={HANOI_BOUNDS}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      // A pin is placed on a flat street map: no tilting or turning it.
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      interactive={interactive}
      attributionControl={{ compact: true }}
      locale={{ "Map.Title": label }}
      onMoveEnd={onMoveEnd && ((event: ViewStateChangeEvent) => onMoveEnd(viewOf(event)))}
      onError={(event: ErrorEvent) => onFailure?.(event.target ? "tiles" : "unavailable")}
    >
      {pin && (
        <Marker latitude={pin.latitude} longitude={pin.longitude} anchor="bottom">
          <MapPinIcon aria-hidden className="size-10 fill-primary text-primary-foreground" />
        </Marker>
      )}
    </Map>
  );
}

function viewOf({ viewState }: ViewStateChangeEvent): MapView {
  return { latitude: viewState.latitude, longitude: viewState.longitude, zoom: viewState.zoom };
}
