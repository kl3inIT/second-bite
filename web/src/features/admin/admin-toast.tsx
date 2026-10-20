"use client";

import { CircleCheckIcon, InfoIcon, OctagonXIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Toast,
  ToastContent,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  useToastManager,
} from "@/components/ui/toast";

type Tone = "success" | "error" | "info";

const manager = createToastManager();
const SHOWN_FOR_MS = 5000;

/**
 * Says how an admin's action went, in one line at the bottom right (Figma Admin/Toast 228:5568): "Đã chặn
 * Tiệm bánh Pháp". Every admin notice is a toast; none sits in the page (docs: admin-web-flow). The screen reader
 * reads it out; it goes by itself.
 */
export function showAdminToast(message: string, tone: Tone = "success") {
  manager.add({ title: message, type: tone, timeout: SHOWN_FOR_MS });
}

const icons: Record<Tone, ReactNode> = {
  success: <CircleCheckIcon aria-hidden className="size-5 shrink-0" />,
  info: <InfoIcon aria-hidden className="size-5 shrink-0" />,
  error: <OctagonXIcon aria-hidden className="size-5 shrink-0" />,
};

/** Shows the admin's toasts; the admin layout renders it once. */
export function AdminToaster({ children }: { children: ReactNode }) {
  return (
    <ToastProvider toastManager={manager}>
      {children}
      <ToastPortal>
        <ToastViewport className="sm:right-6 sm:bottom-6 sm:max-w-md">
          <AdminToasts />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

function AdminToasts() {
  const { toasts } = useToastManager();
  return toasts.map((item) => (
    <Toast key={item.id} toast={item} variant="admin">
      <ToastContent variant="admin">
        {icons[(item.type as Tone | undefined) ?? "success"]}
        <ToastTitle variant="line" />
      </ToastContent>
    </Toast>
  ));
}
