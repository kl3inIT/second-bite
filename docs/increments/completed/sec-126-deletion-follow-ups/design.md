# SEC-126 — Account deletion, the low-risk follow-ups: design

Tracked in Linear as SEC-126. These are the Low findings of the review of pull request 33 (account deletion, [SEC-37](../../completed/sec-37-account-deletion/design.md)), split from SEC-70. None blocks the pilot.

## 1. A request that commits after the deletion

**Problem:** a request authenticated just before the deletion commits can commit after the listeners have run. Examples are opening a store, following one, uploading a photo or writing in an order's chat. The deletion ends the session, so later requests are refused, but one already past authentication is not. It can leave a membership, a favourite, a chat or an unused photo that names an account no longer there. The worst case is an active store whose only owner is gone.

**Chosen:** the deletion writes `AccountDeletedEvent` twice in its transaction.

- The first delivery is at once, as today.
- The second is scheduled two minutes later and sweeps up what a late request left.
- Every listener already runs safely twice (SEC-37 tests deliver the event twice), so the second run only changes what appeared since the first.
- `platform.PublishAfter(ctx, tx, events, event, delay)` writes the listeners' jobs with River's `ScheduledAt`. `platform.Publish` is unchanged.
- Two minutes is far past any request's life: the server stops writing after 30 seconds (`WriteTimeout`), and a listener run is bounded at one minute.

**Not chosen:**

- **Delaying the only delivery:** a deleted owner's store would stay active, and take orders, for those minutes.
- **Re-checking the account inside each request:** every module that writes an account identifier (seller, file, order, offer) would need a lock shared with identity. That means a new cross-module edge for each, and a check that is easy to forget in the next module.

## 2. Forgetting a person's emails scans the table

`ForgetRecipient` deletes `WHERE lower(recipient) = lower(@recipient)`, and no index matches it. Migration `0031_notification_add_recipient_index.sql` adds `notification_emails_recipient` on `lower(recipient)`. The table is small during the pilot, so a plain `CREATE INDEX` in goose's transaction is enough.

## 3. A deletion code shares the sign-in code's limits

**Problem:** asking for a deletion code ends the person's live sign-in code and spends the address's allowance of ten an hour. Someone holding a stolen session can keep asking for deletion codes and stop the owner signing in for an hour.

**Chosen:** each purpose has its own limits and its own live code.

- `ChallengeUsage` and `EndLiveChallenges` take the purpose. A new code ends only the earlier codes of its own purpose, and only those codes count toward its limits.
- Sign-in keeps one a minute, ten an hour, fifteen wrong guesses an hour and thirty a day.
- Deletion gets one a minute, **three an hour**, and the same limits on wrong guesses, counted on deletion codes only. A person needs one deletion code, maybe a second if the first is lost.
- Asking for a sign-in code no longer ends a live deletion code, and the reverse. A code still works only for its own purpose (`SpendAttempt` checks it), so neither can stand in for the other.
- The wrong-guess limits still bound guessing: at most five guesses a code, and the hourly and daily limits per purpose.

## 4. A failure part-way through forgetting an uploader

`forgetUploader` deletes each unused photo's objects before its row, so a failure leaves the row for the next attempt. Nothing tests that yet. The photos are now read in the order of their identifiers, so a retry starts where the failed run stopped, and the test can tell which photo comes second. An internal test in package `file` wraps the Postgres store so that deleting the second photo's objects fails:

- the first run fails, and the first photo's row and objects are gone while the second's row stays;
- the next run, with the store working again, deletes the second.

## Verification plan

- **Go:**
  - `platform`: `PublishAfter` writes one job per listener, scheduled after the delay.
  - `identity`: a deletion writes each listener's job twice, the second two minutes later. A deletion code leaves the live sign-in code working and spends none of its allowance; a fourth deletion code in an hour is refused; a sign-in code still cannot delete, and a deletion code still cannot sign in.
  - `seller`: a store opened by the account after the first delivery is blocked by the second.
  - `file`: the part-way failure above.
  - `migrations`: the name rule.
- **Through the API** (`TestService`): the deletion flow with the purposes kept apart.
- **Against the real service:**
  - ask for a sign-in code, then a deletion code, and sign in with the first;
  - ask for four deletion codes and see the fourth refused with `Retry-After`;
  - see the delete use the index (`EXPLAIN`);
  - delete the account, see the second delivery's jobs scheduled two minutes later, and see it sweep up a store written after the first.
