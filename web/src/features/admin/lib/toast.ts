import { toast } from "@/components/ui/toast";

type Tone = "success" | "error" | "info" | "warning";

const SHOWN_FOR_MS = 5000;

/**
 * Says how an admin's action went, in the shared toast at the bottom right: "Đã chặn Tiệm bánh Pháp". Every
 * admin notice is a toast; none sits in the page (docs: admin-web-flow). The tone picks the toast's own icon.
 */
export function showAdminToast(message: string, tone: Tone = "success") {
  toast.add({ title: message, type: tone, timeout: SHOWN_FOR_MS });
}
