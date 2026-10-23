# Posting prices and pickup times

Accepted by the founder on 23 October 2026 in the Figma review, including P3f–P3m in `Secondbite`. Linear recording is deferred to the next session at the founder's request; this increment has no issue number yet.

The subsequent [phone review](../pickup-time-wheels/design.md) replaces the numeric time editor with scrolling wheels, gives both time rows five cells and strengthens the choice outlines.

The last step of the posting drawer shows the dish photo and name, with the original price struck through above the calculated sale price. Below it are two equal fields: original price on the left and quantity on the right. A full-width row offers 20%, 30%, 40%, 50% and Other; new posts start at 20%. Other opens 60–90% and a custom percentage editor. Cancel discards draft changes. Prices are calculated in whole đồng, rounded down; the existing minimum price of 1,000 đồng and minimum discount still apply. Editing keeps an existing exact price until a price control changes, and prices remain locked when portions have been ordered.

Pickup comes last, with a compact summary beside its heading. Start choices show the current Vietnam time captured when the drawer opens, the next two whole hours, and Other. There is no separate Now button. End choices are the start plus 60, 90, 120 and 180 minutes, then Other. Changing the start resets the end to one hour later. Other opens a compact anchored hour/minute editor with numeric inputs, adjacent stepping controls, Cancel and Apply. All 60 minutes are selectable. The existing 30-minute to six-hour limit applies; overnight windows retain their dates, and the UI names a date when it differs from today.

All three choice rows fill the drawer and stay on one line on phones. Existing semantic tokens, Base UI popovers, form controls, translations and generated API calls are reused. No backend contract changes or catalog insertion are required.
