"use client";

import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ReactNode } from "react";

import type { Point } from "@/components/map/location-picker";
import { usePlaceSuggestions } from "@/components/map/use-place-suggestions";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { searchPlaces, type PlaceBody } from "@/lib/api/generated";

/**
 * A store's address with places suggested as it is typed (SEC-66), as Grab and ShopeeFood suggest one: picking a
 * place writes its address, with the house number typed first, and moves the store's pin there. What is typed
 * stays free text: a store whose address has no suggestion is written and pinned by hand.
 */
export function AddressInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  onPlace,
  placeholder,
  invalid,
  describedBy,
  children,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** A suggestion was picked: its point, for the pin. */
  onPlace: (point: Point) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  /** Addons at the input's end, such as the location button. */
  children?: ReactNode;
}) {
  const t = useTranslations("StoreLocation");
  // No suggestions: the person writes the address and pins it on the map.
  const { places, search, clear } = usePlaceSuggestions((q) =>
    searchPlaces({ query: { q } }).then(({ data }) => data.places ?? []),
  );
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);

  return (
    <Autocomplete
      items={places}
      filter={null}
      itemToStringValue={(place: PlaceBody) => place.address}
      value={value}
      onValueChange={(next, details) => {
        onChange(next);
        if (details.reason === "item-press") {
          const place = places.find((p) => p.address === next);
          if (place) onPlace({ latitude: place.latitude, longitude: place.longitude });
          clear();
          return;
        }
        if (details.reason === "input-change") search(next);
      }}
      open={open && places.length > 0}
      onOpenChange={setOpen}
    >
      <InputGroup ref={group}>
        <AutocompleteInput
          id={id}
          name={name}
          onBlur={onBlur}
          placeholder={placeholder}
          // Chrome ignores "off" for an address and fills the person's saved one; a token it does not know stops it,
          // so only the places suggested here fill the store's address (SEC-191).
          autoComplete="store-address"
          aria-required
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          render={<InputGroupInput />}
        />
        {children}
      </InputGroup>
      <AutocompleteContent anchor={group}>
        <AutocompleteStatus>{t("suggestions", { count: places.length })}</AutocompleteStatus>
        <AutocompleteList>
          {(place: PlaceBody) => (
            <AutocompleteItem key={`${place.address}-${place.latitude}`} value={place}>
              <MapPinIcon aria-hidden className="text-muted-foreground" />
              <span>{place.address}</span>
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
