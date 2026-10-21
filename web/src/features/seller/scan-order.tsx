"use client";

import jsQR from "jsqr";
import { CircleAlertIcon, ScanQrCodeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { getOrder } from "@/lib/api/generated";

import { orderIdOf } from "./order-code";

/** How often a frame of the camera is read, and the widest it is drawn to be read: a phone's full frame is far more than a QR needs. */
const READ_EVERY_MS = 150;
const READ_WIDTH = 640;

const squareControl =
  "relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-input bg-card text-foreground transition-colors outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50";

// The scanner of the Đơn tab (Figma Q5l, Q5m, Q5n): the camera reads the QR the customer's order page shows
// (SEC-86), and an order of this store opens its page at once (SEC-102). Any other code says it is no order of the
// store and the camera goes on reading. The button is an icon, so its name is for assistive technology.
export function ScanOrder({ sellerId }: { sellerId: string }) {
  const t = useTranslations("ScanOrder");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t("open")}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={squareControl}
      >
        <ScanQrCodeIcon aria-hidden className="size-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("hint")}</DialogDescription>
          </DialogHeader>
          {open && <Scanner sellerId={sellerId} onDone={() => setOpen(false)} />}
          <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
            {t("close")}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

type Problem = "camera" | "notOurs";

// The camera and the loop that reads it, alive while the scanner is open: the stream's tracks stop with it.
function Scanner({ sellerId, onDone }: { sellerId: string; onDone: () => void }) {
  const t = useTranslations("ScanOrder");
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const [problem, setProblem] = useState<Problem>();

  useEffect(() => {
    let stream: MediaStream | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let checking = false;
    let lastCode = "";
    const canvas = document.createElement("canvas");

    async function check(code: string) {
      const id = orderIdOf(code);
      if (!id) {
        setProblem("notOurs");
        return;
      }
      try {
        const { data } = await getOrder({ path: { orderId: id } });
        if (data.seller.id !== sellerId) throw new Error("another store's order");
        stopped = true;
        onDone();
        router.push(`/stores/${sellerId}/orders/${id}`);
      } catch {
        setProblem("notOurs");
      }
    }

    function read() {
      const element = video.current;
      if (stopped || !element) return;
      timer = setTimeout(read, READ_EVERY_MS);
      if (checking || element.readyState < element.HAVE_ENOUGH_DATA) return;

      const scale = Math.min(1, READ_WIDTH / element.videoWidth);
      canvas.width = Math.round(element.videoWidth * scale);
      canvas.height = Math.round(element.videoHeight * scale);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(element, 0, 0, canvas.width, canvas.height);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      const found = jsQR(data, canvas.width, canvas.height, { inversionAttempts: "dontInvert" });
      if (!found || found.data === lastCode) return;

      // The same code held in front of the camera is read once; another one is read again.
      lastCode = found.data;
      checking = true;
      void check(found.data).finally(() => {
        checking = false;
      });
    }

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch {
        if (!stopped) setProblem("camera");
        return;
      }
      if (stopped || !video.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      video.current.srcObject = stream;
      await video.current.play().catch(() => undefined);
      read();
    }

    void start();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [sellerId, onDone, router]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-foreground">
        <video ref={video} muted playsInline aria-hidden className="size-full object-cover" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-6 rounded-3xl border-4 border-background"
        />
      </div>
      {problem && (
        <Alert variant="destructive">
          <CircleAlertIcon aria-hidden />
          <AlertDescription>{problem === "camera" ? t("noCamera") : t("notOurs")}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
