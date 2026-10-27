# SEC-162 — The store's staff on the web, and a store handed to its owner: design

Tracked in Linear as SEC-162. It serves the sponsor's row S-01 ("the team pre-creates the store's account and the store opens a link to get in") and the plan of 30 October, which opens accounts for five stores. Figma, drawn for this increment:

| Frame | What it shows |
| --- | --- |
| N1 | the owner's page "Nhân viên của quán" |
| N2 | the dialog that removes someone |
| N3 | the page as staff see it, with "Rời quán" |
| N1m | N1 at 390 |
| AD-QD4b | the admin's members tab with "Đổi chủ quán" |
| AD-QD4c | its dialog |

## What is already there

- **The API:**
  - Lists a seller's members, to its members and admins.
  - Adds staff by email, for the owner. An address that never signed in gets its account then.
  - Removes staff: the owner removes anyone, and a staff member removes themself.
- **The web:** none of these on the store's side. Only the admin's store page lists the members (AD-QD4).
- **Admins cannot change a seller's owner.** A store the team opens is owned by the team member who opened it, with no way to hand it to the person who runs it. `docs/specs/seller.md` lists this under "Not yet".

## What a person can do

- **The owner:**
  - Opens "Nhân viên" from the store's menu (N1, and N1m on a phone).
  - Sees everyone in the store, themself first as "Chủ quán".
  - Adds staff by email.
  - Removes someone after the confirm dialog (N2).
- **Staff:**
  - See the same list, without the form (N3).
  - Leave the store from their own row, after the same kind of confirm.
- **Admins:**
  - On a store's members tab (AD-QD4b), press "Đổi chủ quán" and type the new owner's email (AD-QD4c).
  - That account becomes the owner, at once. An address that never signed in gets its account then, as when staff are added.
  - The previous owner stays on as staff, so nobody loses the store by surprise; the new owner can remove them.
  - A store left without an owner, once its owner deleted their account (SEC-37, SEC-65), gets one this way, and admins can then approve it again.

## Shape

- **Server, module `seller`:**
  - `POST /admin/sellers/{sellerId}/owner {email}` → `200 {members}`, for admins.
  - **Locks:** the seller's row, then the new owner's advisory lock, in that order. A new owner who already owns five sellers is refused, the same rule as opening one.
  - **The swap:** the previous owner becomes staff, then the account becomes the owner. The unique index on one owner per seller holds between the two.
  - **People limit:** 30 people at most per seller, counted only when the new owner was not already a member.
  - **Audit:** `seller.change_owner`, with both accounts' identifiers.
  - **Failures:**
    - `SELLER_ALREADY_OWNER` (409) when the account already owns this store;
    - `SELLER_NEW_OWNER_LIMIT_REACHED` (409) when it owns five;
    - `SELLER_STAFF_LIMIT_REACHED` when the store is full;
    - the identity failures for the address, as when adding staff.
- **Web:**
  - `/stores/{id}/staff` with the list, the form for the owner, and confirm dialogs. The store menu gains "Nhân viên".
  - The admin's members tab gains "Đổi chủ quán" and its dialog.
  - The audit log names the new action.

## Not chosen

- **An invitation the person must accept:** adding by email is one step already (Open Food Network adds a manager the same way), and the stores of the pilot are visited in person.
- **Removing the previous owner when the store changes hands:** they may be the person who helped the store start. The new owner decides.
- **An email to the new owner or new staff:** the team tells them at the visit. The emails stay under "Not yet".

## Verification plan

- **Go:**
  - who may change the owner (admins only);
  - an unknown store;
  - the new owner who is already staff, a stranger, the owner already, or the owner of five;
  - a store full of people;
  - an ownerless store getting an owner;
  - the previous owner left as staff;
  - one audit event.
- **Playwright with axe, on a phone and a computer:**
  - the owner adds and removes staff;
  - staff see the list and leave;
  - the admin changes the owner.
- **The real service:** the flow above on the server and the web's production build.
