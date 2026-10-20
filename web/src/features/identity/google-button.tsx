"use client";

import Image from "next/image";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

// Google's own button (Google Identity Services, SEC-29 › decision 3), drawn by Google's script. Google draws
// it 40 px high, and Figma L6 asks for 52, so the button a person sees is ours, with Google's mark and its
// approved wording, and Google's own button lies over it, unseen, stretched to the same height and taking the
// click. If Google's branding rules rule that out, the visible button goes and the 40 px one stays. Google hands back an ID token; the page posts it with the
// random value whose SHA-256 it gave Google as the nonce (decision 6).

type CredentialResponse = { credential: string };
type GoogleIdentity = {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        nonce: string;
        callback: (response: CredentialResponse) => void;
        ux_mode: "popup";
        context: "signin";
        use_fedcm_for_button: boolean;
      }): void;
      renderButton(
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "pill";
          logo_alignment: "center";
          width: number;
          locale: string;
        },
      ): void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

/** Google draws its button at most 400 px wide. */
const MAX_WIDTH = 400;

export function GoogleButton({
  clientId,
  onCredential,
}: {
  clientId: string;
  onCredential: (idToken: string, nonce: string) => void;
}) {
  const locale = useLocale();
  const t = useTranslations("SignIn");
  const slot = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const callback = useRef(onCredential);
  useEffect(() => {
    callback.current = onCredential;
  });

  useEffect(() => {
    const google = window.google;
    const parent = slot.current;
    if (!loaded || !google || !parent) return;
    let cancelled = false;
    const nonce = randomNonce();
    void sha256Hex(nonce).then((hashed) => {
      if (cancelled) return;
      google.accounts.id.initialize({
        client_id: clientId,
        nonce: hashed,
        callback: (response) => callback.current(response.credential, nonce),
        ux_mode: "popup",
        context: "signin",
        use_fedcm_for_button: true,
      });
      google.accounts.id.renderButton(parent, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width: Math.min(parent.offsetWidth, MAX_WIDTH),
        locale,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [loaded, clientId, locale]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => setLoaded(true)} />
      <div className="relative h-13 w-full overflow-hidden rounded-full border border-border bg-card">
        <span
          aria-hidden
          className="pointer-events-none flex h-full items-center justify-center gap-2.5 text-body-sm-strong text-foreground"
        >
          <Image src="/google-g.svg" alt="" width={20} height={20} unoptimized />
          {t("google")}
        </span>
        <div
          ref={slot}
          className="absolute inset-x-0 top-0 flex origin-top scale-y-130 justify-center opacity-0"
        />
      </div>
    </>
  );
}

function randomNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** The address in a Google ID token, read without checking it, only to name it to the person. */
export function emailInToken(idToken: string): string | undefined {
  try {
    const payload = idToken.split(".")[1] ?? "";
    const json = atob(payload.replaceAll("-", "+").replaceAll("_", "/"));
    const claims: unknown = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(json, (c) => c.charCodeAt(0))),
    );
    return typeof claims === "object" &&
      claims !== null &&
      "email" in claims &&
      typeof claims.email === "string"
      ? claims.email
      : undefined;
  } catch {
    return undefined;
  }
}
