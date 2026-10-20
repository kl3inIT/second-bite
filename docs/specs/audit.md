# audit

Owns the trail of what admins did, which admin did what to which store, account or setting, when and why (table `audit_events`). Decided in SEC-75 ([design](../increments/active/sec-75-admin-foundation/design.md#the-audit-trail)). The log is for developers; this trail is for whoever answers a complaint.

## Operations

None yet. Admins read the trail once its screen exists (Figma row 11, Nhật ký).

Published to other modules: `Record(ctx, tx, resource, action)`, which writes one event in the transaction of the change it records, and `ForgetAccount(ctx, tx, account)`, which `identity` calls in the transaction that deletes an account.

## Rules

- Only the actions of the module's catalog are recorded. Each is a Go type of the module, and its fields are the event's details, written as a JSON object. A detail no type declares cannot be written, and none holds a secret or personal data. An action's name is `subject.verb` and never changes meaning.
- Not recorded: what customers and members do, an admin only reading, signing in and out. Those are the log's.
- An event and its change are kept together or not at all, since both are written in one transaction.
- The actor is the caller of the request: its account and its address at that moment (`platform.Caller.Label`, read with the session). From the command line there is no actor and no request.
- Recording also logs `audit.event.recorded` with the action, the resource's type and identifier, and the actor's identifier, never a label. The request's identifier joins the two.
- The table is append-only by the module's code: it only inserts, and only nulls labels. Nothing else touches it.
- When an account is deleted, the labels naming it, as the actor or as the resource, are nulled; its identifier and its actions stay. A store's name stays, since it names a store, not a person.

## Catalog

| Action | Resource | Details | Recorded by |
| --- | --- | --- | --- |
| `offer_settings.change` | `offer_settings`, `current` | `fields`: the settings changed, as the API names them | `offer` |
| `email_settings.change` | `email_settings`, `current` | `provider`; `fields`: the settings changed, a secret by name only | `notification` |
| `admin.grant` | `account`, its identifier, its address | `source`: `admin` or `command_line` | `identity` |
| `admin.revoke` | `account`, its identifier, its address | `source`: `admin` or `command_line` | `identity` |

## Data

| Table | Holds | Lifecycle |
| --- | --- | --- |
| `audit_events` | When; the action; the actor's account (no foreign key) and address; the resource's type, identifier and label; the details; the request's identifier | Kept; the labels naming an account are nulled when it is deleted |
