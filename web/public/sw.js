// Second Bite's service worker (SEC-25): it shows the notices the server pushes about an order and opens the
// order's page when one is tapped. It caches nothing. The server sends Declarative Web Push JSON, which Safari
// shows by itself; this script shows the same message on the other browsers.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

/** The page a notice opens: an address on this site, or the home page. */
function pageOf(navigate) {
  try {
    const url = new URL(navigate, self.location.origin);
    return url.origin === self.location.origin ? url.href : self.location.origin;
  } catch {
    return self.location.origin;
  }
}

self.addEventListener("push", (event) => {
  // A browser that read the message as Declarative Web Push shows it itself.
  if (event.notification) return;
  let notice;
  try {
    notice = event.data?.json().notification;
  } catch {
    return;
  }
  if (!notice || typeof notice.title !== "string") return;
  event.waitUntil(
    self.registration.showNotification(notice.title, {
      body: notice.body,
      lang: notice.lang,
      // A newer notice about the same order replaces the older one, and still rings.
      tag: notice.tag,
      renotify: Boolean(notice.tag),
      icon: "/icons/icon-192.png",
      data: { page: pageOf(notice.navigate) },
    }),
  );
});

// Tapping a notice opens its order: in the tab already showing it, else in a tab of this site led there, else
// in a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const page = event.notification.data?.page ?? self.location.origin;
  event.waitUntil(
    (async () => {
      const tabs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const showing = tabs.find((tab) => tab.url === page);
      if (showing) return showing.focus();
      for (const tab of tabs) {
        try {
          const led = await tab.navigate(page);
          if (led) return led.focus();
        } catch {
          // A tab this script does not control cannot be led; try the next.
        }
      }
      return self.clients.openWindow(page);
    })(),
  );
});
