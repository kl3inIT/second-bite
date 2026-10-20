# SEC-55 — The seller's catalog: design

Status: started on 20 October 2026. Tracked in Linear as SEC-55; the screens are drawn in [SEC-53](../sec-53-seller-web-design/design.md) (Figma Q3, Q3b, Q3c, C1, C2, D1, and the dish step of P2); the web around it is [SEC-57](../sec-57-seller-web/design.md).

## Decisions

The three questions SEC-55 left open, answered:

1. **Where it lives: the `offer` module.** The catalog exists to post offers faster, is private to a seller's people, and uses the same right as posting (an owner or staff of an active seller). A module of its own would have one consumer and nothing to publish ([boundary discovery](../../../conventions.md#boundary-discovery)).
2. **A post copies the dish; it does not refer to it.** The web fills the post's form from the dish, and the offer stores its own name, kind, unit, description and photo, as it already does. A later edit of the dish never changes a live offer, and deleting a dish does not touch the posts made from it.
3. **A one-off dish is not saved into the catalog.** Figma P2b keeps "Món đột xuất" apart from "Từ danh mục"; a seller adds a dish to the catalog on purpose.

## What the catalog holds

The stable base of a dish only, as Karma's items and Too Good To Go's listings split it from the daily post:

- Required: a photo, a name (1 to 80 characters), a kind (the offer's six kinds).
- Optional: a unit (up to 20 characters, `suất` when empty), a description (up to 1,000), the ingredients and allergens (one text, up to 500, Figma "Thành phần và dị ứng"), and an original price (what one unit normally sells for, from 1,001 đồng; a post starts from it and still sets its own), and whether it is shown or hidden in the list the post form picks from.
- No selling price, hours, units or status: those belong to the post. Portion, "usually in the bag", diet and notes for use, which SEC-55 listed, are left out until a seller asks for them.

A seller has at most 100 dishes.

## Operations

| Operation | Who | Answer |
| --- | --- | --- |
| `GET /sellers/{sellerId}/dishes` | The owner or staff of an active seller | `200` the dishes, newest first, hidden ones included |
| `POST /sellers/{sellerId}/dishes` | Same | `201` the dish |
| `PATCH /dishes/{dishId}` | Same, through the dish's seller | `200` the dish |
| `DELETE /dishes/{dishId}` | Same | `204` |

The photo of a dish is one the caller uploaded, which the dish claims, or one the seller already shows (an offer or another dish). So a post made from a dish may send the dish's photo, as posting again already does.

## Failures

`OFFER_DISH_NOT_FOUND` (404, also for another seller's dish), `OFFER_DISH_LIMIT_REACHED` (409), and the offer module's `OFFER_DETAILS_INVALID` for a field out of bounds.

## The web

The Danh mục tab lists the dishes with "Sửa" and "Đăng ngay" (Figma Q3b; a hidden dish is dimmed, with "Hiện lại"), "Thêm món" and "Sửa món" are pages with the form of Figma Q3c and C1, delete asks first (C2), and "Đăng ngay" opens the post drawer at its last step with the dish filled in (D1). The post drawer's dish step lists the shown dishes under "Từ danh mục", and the earlier posts under "Món đã đăng" until the catalog has some.
