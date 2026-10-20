# SEC-61 — Edit the display name: design

Tracked in Linear as SEC-61. It completes account settings ([SEC-37](../../completed/sec-37-account-deletion/design.md#account-settings)), which showed the display name read-only, and keeps the privacy policy's word that people change it themselves.

## What a person can do

- In account settings, on the web and in the app, the display-name row opens a field with Save and Cancel (the web inline, the app in a sheet).
- The name is saved trimmed. The header, the account tab and settings show it at once.
- A name the server refuses reads in the person's language, at the field (SEC-28). A request that got no answer keeps the screen's own sentence.
- A Google sign-in afterwards keeps the chosen name: Google fills a name only while it is empty.

## Shape

- **Server:** `identity` gains `PUT /accounts/me` `{displayName}` and `IDENTITY_DISPLAY_NAME_INVALID`. There is no new table: `identity_accounts.display_name` exists.
- **The rule lives in the module** (1 to 50 characters once trimmed, no control character, valid UTF-8). The contract only bounds the body (`maxLength: 200`), so a refused name reads in the module's words, not huma's. This is the lesson of SEC-28's run against the real service.
- **Web:** `DisplayNameRow`, a client component inside the settings page's list; after saving, `router.refresh()` reads the account again for the header and the tab.
- **App:** a sheet over account settings; `CurrentAccount.setDisplayName` puts the answer in the signed-in account, so every screen watching it follows.

## Verification plan

- **Go:** the rule's unit test; the service keeping the chosen name against Google's fill; the HTTP flow in both languages in `TestService`.
- **Web:** browser tests of a refused name, a saved one and a cancelled edit, with axe.
- **App:** widget tests of the sheet saving and of the server's words on a refusal.
- **Against the real service:** the name changed on the web and in the app and seen in the header; a refused name in Vietnamese and English.
