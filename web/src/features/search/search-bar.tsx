"use client";

import { ArrowLeftIcon, HistoryIcon, SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { offerKinds } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";

import { clearSearches, forgetSearch, rememberSearch, useRecentSearches } from "./recent-searches";

// The search's top bar (Figma K2 đầu trang tìm kiếm): a plain back arrow and a fully rounded field on the
// sky ground, a GET form over the address that keeps the place and the tab. While the field is focused and
// empty, the recent searches and the kinds open under it (Figma K2a).
export function SearchBar({ value, near, tab }: { value?: string; near?: string; tab?: string }) {
  const t = useTranslations("Search");
  const kinds = useTranslations("OfferKind");
  const recent = useRecentSearches();
  const input = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState(value ?? "");
  const [focused, setFocused] = useState(false);
  const place = near ? { near } : {};

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
      <div className="flex items-center gap-1 px-2 py-2">
        <Link
          href={{ pathname: "/", query: place }}
          aria-label={t("back")}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <ArrowLeftIcon aria-hidden className="size-5" />
        </Link>
        <search className="min-w-0 flex-1">
          <form>
            {near && <input type="hidden" name="near" value={near} />}
            {tab && <input type="hidden" name="tab" value={tab} />}
            <InputGroup surface="sky">
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
        <div className="absolute inset-x-0 top-full z-30 flex flex-col gap-5 bg-card px-4 pt-2 pb-6 shadow-sheet">
          {recent.length > 0 && (
            <section aria-labelledby="recent-searches" className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 id="recent-searches" className="text-headline text-foreground">
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
                      href={{ pathname: "/search", query: { ...place, q: item } }}
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
          <section aria-labelledby="search-kinds" className="flex flex-col gap-3">
            <h2 id="search-kinds" className="text-headline text-foreground">
              {t("kinds")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {offerKinds.map((kind) => (
                <li key={kind}>
                  <Link
                    href={{ pathname: "/search", query: { ...place, kind } }}
                    className={buttonVariants({ variant: "chip", size: "chip" })}
                  >
                    {kinds(kind)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
