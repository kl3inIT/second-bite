// Marks the page as a pushed screen of the store (a dish form): on a phone the layout then shows the top bar and
// not the header and the tab bar, by CSS alone (`group-has-[[data-pushed]]`), so no script has to learn the address.
// It is in the page's own shell, outside Suspense, so the right layout is there from the first paint.
export function PushedMarker() {
  return <span hidden data-pushed />;
}
