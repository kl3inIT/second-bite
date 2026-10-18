// The leaf that sweeps across the header's top right over the lime (Figma header › sweep). It keeps its
// drawn size and stays pinned to the right, so a wide header shows more lime instead of a stretched leaf.
export function HeaderSweep() {
  return (
    <svg
      viewBox="0 0 390 260"
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 h-65 w-97.5"
    >
      <path d="M390 0H0V260H390V0Z" className="fill-sweep" />
      <path
        d="M0 0H362C292 30 246 82 226 132C210 172 150 214 0 262V0Z"
        className="fill-sweep-edge"
      />
      <path d="M0 0H332C262 30 216 80 196 128C180 168 120 208 0 236V0Z" className="fill-shell" />
    </svg>
  );
}
