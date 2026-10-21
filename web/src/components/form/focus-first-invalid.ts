// Adapted from BeyondPilot's web/src/components/form/focus-first-invalid.ts (revision 5fd043a8).
/** How many frames the search for a control in error goes on after a refusal. */
const FRAMES = 10;

/**
 * Moves focus to the first control in error inside `root` that can take it, in document order, and
 * brings it to the middle of the screen: after a refused submit the person lands on what to
 * correct. A control in error is one that says so with `aria-invalid="true"`. One that cannot be
 * focused, such as a group, a hidden input or a disabled control, is passed over for the next; one
 * that hands the focus to a control inside it counts. Says whether a control took the focus.
 */
export function focusFirstInvalid(root: ParentNode | null | undefined): boolean {
  for (const control of root?.querySelectorAll<HTMLElement>('[aria-invalid="true"]') ?? []) {
    // Focus alone would scroll the control to the nearest edge, under a sticky bar.
    control.focus({ preventScroll: true });
    const active = control.ownerDocument.activeElement;
    if (active === control || control.contains(active)) {
      control.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      return true;
    }
  }
  return false;
}

/**
 * {@link focusFirstInvalid} once the refusal is on the screen. The errors reach the form's state
 * before React has drawn them, so the search starts on the next frame and, while no control in
 * error takes the focus, goes on for a few frames more.
 */
export function focusFirstInvalidSoon(root: () => ParentNode | null | undefined) {
  let left = FRAMES;
  const attempt = () => {
    left -= 1;
    if (!focusFirstInvalid(root()) && left > 0) {
      requestAnimationFrame(attempt);
    }
  };
  requestAnimationFrame(attempt);
}
