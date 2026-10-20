// The light sweep across the header (Figma header › sweep, 390×325): two bands of the pale blue over the
// header's own blue. Like Figma's vectors it scales with the header, so the pale ground always reaches the
// header's foot instead of stopping at a drawn height.
export function HeaderSweep() {
  return (
    <svg
      viewBox="0 0 390 325"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    >
      <path d="M390 0H0V325H390V0Z" className="fill-sweep" />
      <path
        d="M0 0H362C292 37.5 246 102.5 226 165C210 215 150 267.5 0 327.5V0Z"
        className="fill-sweep-edge"
      />
      <path
        d="M0 0H332C262 37.5 216 100 196 160C180 210 120 260 0 295V0Z"
        className="fill-header"
      />
    </svg>
  );
}
