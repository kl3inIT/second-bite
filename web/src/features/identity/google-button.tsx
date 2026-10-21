"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

// Google's own button (Google Identity Services, SEC-29 › decision 3), drawn by Google's script as Google
// draws it, 40 px high. It stays visible: Google ignores a press on its button while the button cannot be
// seen, so the look-alike of SEC-56 with Google's button laid over it at no opacity signed no one in (SEC-77).
// Google draws the button at a fixed width, so it is drawn again when its slot changes width. Google hands
// back an ID token; the page posts it with the random value whose SHA-256 it gave Google as the nonce
// (decision 6).

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
  const slot = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const callback = useRef(onCredential);
  useEffect(() => {
    callback.current = onCredential;
  });

  useEffect(() => {
    const google = window.google;
    const parent = slot.current;
    if (!loaded || !google || !parent) return;
    let cancelled = false;
    let drawnWidth = 0;
    const draw = () => {
      const width = Math.min(parent.offsetWidth, MAX_WIDTH);
      if (width === 0 || width === drawnWidth) return;
      drawnWidth = width;
      google.accounts.id.renderButton(parent, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width,
        locale,
      });
      setDrawn(true);
    };
    const resized = new ResizeObserver(draw);
    const nonce = randomNonce();
    void sha256Hex(nonce).then((hashed) => {
      if (cancelled) return;
      google.accounts.id.initialize({
        client_id: clientId,
        nonce: hashed,
        callback: (response) => callback.current(response.credential, nonce),
        ux_mode: "popup",
        context: "signin",
        use_fedcm_for_button: false,
      });
      resized.observe(parent);
    });
    return () => {
      cancelled = true;
      resized.disconnect();
    };
  }, [loaded, clientId, locale]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => setLoaded(true)} />
      <div className="relative flex h-11 w-full items-center">
        {!drawn && (
          <Skeleton
            aria-hidden
            shape="circle"
            className="absolute inset-x-0 mx-auto h-10 max-w-100"
          />
        )}
        <div ref={slot} className="flex w-full justify-center" />
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
