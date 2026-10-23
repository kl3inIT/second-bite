# Pickup time wheels

The founder's phone review on 23 October 2026 replaces the numeric time editor shipped in PR #139. The two columns should behave like iPhone alarm wheels: drag or scroll the hours and minutes, with the selection in the middle; no text inputs or increment/decrement buttons. Cancel discards the draft and Apply retains the existing start/end validation. A keyboard and screen reader can still adjust each wheel.

Both start and end rows have five equal cells. Start offers the current Vietnam time, the next three whole hours and Other. End keeps its four offsets and Other. Choice outlines use the existing input-edge token instead of the faint divider token, with a 1.5px stroke. The change includes discount choices, which share the same Button variant.

Reuse native overflow scrolling and CSS scroll snapping in a small UI primitive, preserving touch inertia and containing scroll inside the popover. Repeated values allow crossing 23/00 and 59/00 without introducing a date field. No dependency or backend changes are needed. The founder requested CI validation only and deferred Linear updates.

The same phone review also removes the entire seller notification card from the order tab. Keep the existing quiet renewal for browsers that already allow notifications; show no seller prompt, setup instructions, error or status. The customer notification card keeps its current behavior.
