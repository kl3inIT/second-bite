"use client";

import { ChevronLeftIcon, HistoryIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { kindPictures } from "@/features/offers/kind-pictures";
import type { OfferKind } from "@/features/offers/offer";
import { homePath } from "@/features/home/home-query";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { clearSearches, forgetSearch, rememberSearch, useRecentSearches } from "./recent-searches";
import { searchHref } from "./search-query";

// The search's top bar (Figma K2 đầu trang tìm kiếm): a plain back arrow and a fully rounded field on the
// sky ground, a GET form over the address that keeps the place. While the field is focused and
// empty, the recent searches and the popular kinds, each with how many dishes are on sale, cover the page
// under it and its bottom bar (Figma K2a). `desktop` is the field on the customer header from `md` (Figma
// WK2): white on the blue, without the back arrow, its suggestions a card hanging from it.
export function SearchBar({
  value,
  near,
  place,
  kinds: popular = [],
  desktop = false,
}: {
  value?: string;
  near?: string;
  /** The name of the place `near` is, kept with it. */
  place?: string;
  /** The kinds on sale here, the most first. */
  kinds?: readonly { kind: OfferKind; count: number }[];
  desktop?: boolean;
}) {
  const t = useTranslations("Search");
  const recentId = useId();
  const kindsId = useId();
  const kinds = useTranslations("OfferKind");
  const recent = useRecentSearches();
  const input = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState(value ?? "");
  const [focused, setFocused] = useState(false);

  // Whatever was searched, from here or from the home's field, joins the recent searches.
  useEffect(() => {
    if (value) rememberSearch(value);
  }, [value]);

  return (
    <div
      className="relative"
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className={cn("flex items-center gap-1", !desktop && "px-2 py-2")}>
        {!desktop && (
          <Link
            href={homePath({ near, place })}
            aria-label={t("back")}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ChevronLeftIcon aria-hidden className="size-6" />
          </Link>
        )}
        <search className="min-w-0 flex-1 search-cancel-none">
          <form>
            {near && <input type="hidden" name="near" value={near} />}
            {near && place && <input type="hidden" name="place" value={place} />}
            <InputGroup surface={desktop ? "header" : "sky"}>
              <InputGroupAddon>
                <SearchIcon aria-hidden className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                ref={input}
                name="q"
                type="search"
                value={words}
                onChange={(event) => setWords(event.target.value)}
                aria-label={t("label")}
                placeholder={t("placeholder")}
              />
              {words && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={t("clear")}
                    onClick={() => {
                      setWords("");
                      input.current?.focus();
                    }}
                  >
                    <XIcon aria-hidden />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </form>
        </search>
      </div>
      {focused && !words && (
        <div
          className={cn(
            "absolute inset-x-0 top-full flex flex-col gap-4 bg-card px-4 pt-4",
            desktop
              ? "z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl pb-4 text-foreground shadow-card"
              : "h-dvh",
          )}
        >
          {recent.length > 0 && (
            <section aria-labelledby={recentId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 id={recentId} className="text-headline text-foreground">
                  {t("recent")}
                </h2>
                <button
                  type="button"
                  onClick={clearSearches}
                  className={buttonVariants({ variant: "link", size: "inline" })}
                >
                  {t("clearRecent")}
                </button>
              </div>
              <ul>
                {recent.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Link
                      href={searchHref({ near, place, q: item })}
                      className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-body-sm text-foreground"
                    >
                      <HistoryIcon
                        aria-hidden
                        className="size-4.5 shrink-0 text-muted-foreground"
                      />
                      <span className="truncate">{item}</span>
                    </Link>
                    <button
                      type="button"
                      aria-label={t("forget", { words: item })}
                      onClick={() => forgetSearch(item)}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                    >
                      <XIcon aria-hidden className="size-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {popular.length > 0 && (
            <section aria-labelledby={kindsId} className="flex flex-col">
              <h2 id={kindsId} className="text-headline text-foreground">
                {t("popular")}
              </h2>
              <ul>
                {popular.map(({ kind, count }) => (
                  <li key={kind}>
                    <Link
                      href={searchHref({ near, place, kind })}
                      className="flex min-h-14 items-center gap-3 text-body-sm text-foreground"
                    >
                      <Image
                        src={kindPictures[kind]}
                        alt=""
                        sizes="40px"
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate">{kinds(kind)}</span>
                      <span className="text-label text-muted-foreground">
                        {t("onSale", { count })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
