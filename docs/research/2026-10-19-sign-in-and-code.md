# Signing in with an emailed code and Google: evidence (19 October 2026)

Researched 2026-10-19 for SEC-29 (web sign-in). **Verified** means I saw the page, a screenshot I took, primary source text, or source code. **Reported** means it comes from a secondary source or I did not see it myself. Screenshots were taken for the study and are not committed (third-party products); each source links to its page.: 390×844 phone and 1440×900 desktop, `vi-VN` locale, Playwright, taken 2026-10-19. Every flow stopped at its first screen. No address or phone number was submitted anywhere.

## Sources

| # | Source | URL | What was seen | Status | Date seen |
|---|---|---|---|---|---|
| S1 | Shopee web login (phone, desktop, SMS variant) | https://shopee.vn/buyer/login, …/login/otp | Phone: "Số điện thoại/Email/Tên tài khoản" + password; "Đăng nhập bằng SMS" link; "HOẶC"; Facebook, Google, Apple outline buttons below. SMS variant: a single "Số điện thoại" field (`type=tel autocomplete=tel`) and a "Tiếp Theo" button directly under it. Desktop: header with logo + "Đăng nhập" and a 400 px card on a brand banner | verified | 2026-10-19 |
| S2 | Grab web login (from food.grab.com) | weblogin.grab.com | "Đăng nhập vào Grab"; +84 + phone; "Lưu thông tin trên thiết bị này trong 60 ngày"; "Tiếp tục"; "or"; Google, Facebook, Apple as full-width outline buttons the same height as the primary button | verified | 2026-10-19 |
| S3 | Lazada login and OTP step (step DOM read without submitting) | member.lazada.vn/user/login | Apple (filled), Google, Facebook buttons first, then "Nhập mật khẩu" / "Số di động" links; Google One Tap sheet at the bottom. OTP step text: "Nhập mã 6 ký tự đã gửi về số: +84 … thông qua SMS", "Nhận mã mới sau 60s", "Xác minh"; **six separate `type=tel` inputs, no `autocomplete`** | verified | 2026-10-19 |
| S4 | Tiki login | tiki.vn/customer/account/login | "Xin chào, / Đăng nhập hoặc Tạo tài khoản"; phone field; consent checkbox; "Tiếp Tục"; "Đăng nhập bằng email" link; "Hoặc tiếp tục bằng" with round Facebook and Google icons | verified | 2026-10-19 |
| S5 | Bách Hóa Xanh | bachhoaxanh.com | Promo modal "Mời bạn đăng nhập để nhận ưu đãi": a phone field only (`inputmode=tel`) | verified | 2026-10-19 |
| S6 | Uber (Uber Eats sign-in) | auth.uber.com | "Số điện thoại hoặc email của bạn là gì?"; "Tiếp tục"; "hoặc"; "Tiếp tục với Google/Apple" in grey buttons the same size as the primary; "Bạn đồng ý nhận **mã xác minh** qua tin nhắn văn bản hoặc Whatsapp" | verified | 2026-10-19 |
| S7 | Airbnb | airbnb.com.vn/login | "Đăng nhập hoặc đăng ký"; "Số điện thoại hoặc email"; "Tiếp tục"; "hoặc"; Google and Apple as icon-only squares. Desktop: a modal card about 480 px wide over artwork, with logo | verified | 2026-10-19 |
| S8 | DoorDash | identity.doordash.com | Heading "Sign in to access your credits and discounts"; Google, Facebook, Apple first, then "or continue with phone number" | verified (DOM text; screenshot blocked by Cloudflare at 1440) | 2026-10-19 |
| S9 | Linear | linear.app/login; https://linear.app/docs/login-methods | "Log in to Linear": **Continue with Google (filled primary)**, Continue with email, SAML, passkey. The email step is its own screen ("What's your email address?"). The docs say the email holds a link *and* a code for an "Enter code" field | verified | 2026-10-19 |
| S10 | Vercel | vercel.com/login | Email field + "Continue with Email" (filled) first, a divider, then Google/GitHub/… outline buttons. Narrow centred column of about 320 px, no card, logo top-left, footer links only | verified | 2026-10-19 |
| S11 | Notion | app.notion.com/login; notion.com/help/log-in-and-out | Desktop: Email + "Tiếp tục" first, then "hoặc tiếp tục với" and a grid of Google, Apple and other providers. Phone: providers first. The help page says email sign-in uses a verification code | verified (notion-390 DOM, notion-1440) | 2026-10-19 |
| S12 | Slack | slack.com/signin; https://slack.com/help/articles/212681477 | "Enter your email to sign in": email + "Sign In With Email" (filled), "OR SIGN IN WITH", Google and Apple outline buttons. Help: "Check your email for a confirmation code… and enter it". The troubleshooting page says to check spam | verified | 2026-10-19 |
| S13 | Stripe dashboard | dashboard.stripe.com/login | Email + password, "Or sign in with Google / Passkey / SSO" (not passwordless) | verified | 2026-10-19 |
| S14 | Too Good To Go | dev.to/simonmartyr/too-good-to-go-go-463c; toogoodtogo.com support | A third-party post says TGTG's consumer app uses an emailed **magic link**, not a password. The official support page mentions only password reset. Not seen in the app | reported | 2026-10-19 |
| S15 | MoMo help "Tôi không nhận được mã OTP" | https://www.momo.vn/hoi-dap/toi-khong-nhan-duoc-ma-otp | Uses the term "mã OTP"; "không nhận được mã OTP trong vòng 30 giây … nhấn vào 'Gửi lại'"; SMS | verified (page text) | 2026-10-19 |
| S16 | Shopee SMS flow (FPT Shop how-to); Shopee SG help | fptshop.com.vn/tin-tuc/giai-tri/quen-mat-khau-shopee-153078 | SMS login: phone → captcha → "mã OTP" by SMS. The SG help page says to check spam SMS | reported | 2026-10-19 |
| S17 | Grab, Be, ShopeeFood, Zalo, Highlands, Phúc Long code steps | — | No public primary source. Highlands and Grab desktop blocked the bot; Zalo web is QR-only on desktop; phuclong order domain does not resolve; ShopeeFood web hands off to Shopee | gap | 2026-10-19 |
| S18 | GOV.UK Design System, "Confirm a phone number" | https://design-system.service.gov.uk/patterns/confirm-a-phone-number/ | One field; "Allow additional spaces, hyphens and dashes"; examples use `inputmode=numeric` + `autocomplete=one-time-code`; 15-minute expiry; "Not received a text message?" link to a resend page; "Text messages sometimes take a few minutes to arrive"; error "Enter a correct security code". Auto-submit is not mentioned | verified | 2026-10-19 |
| S19 | GOV.UK Design System, "Confirm an email address" | https://design-system.service.gov.uk/patterns/confirm-an-email-address/ | "show the user the email address that you sent their activation email to"; let users resend, including to a different address | verified | 2026-10-19 |
| S20 | GOV.UK One Login frontend source (the live service's own templates and copy) | github.com/govuk-one-login/authentication-frontend `src/components/check-your-email/index.njk`, `src/locales/en/translation.json` (last commit 2026-10-14) | **The closest analogue to us: an emailed 6-digit code.** Heading "Check your email"; inset "We have sent an email to: **addr**"; "The email contains a 6 digit security code."; "Your email might take a few minutes to arrive. If you do not get an email, check your spam folder."; "The code will expire after one hour."; **one** input labelled "Enter the 6 digit code" (`inputmode=numeric`, `autocomplete=one-time-code`, `spellcheck=false`, no `value`, so the field is empty after an error); a **"Continue" button with no auto-submit**; "Problems with the code?" details reading "We can send the code again or you can use a different email address"; wrong code: "The code you entered is not correct, or may have expired, try entering it again or request a new code"; lockout pages after too many wrong codes or resends | verified (source code) | 2026-10-19 |
| S21 | GOV.UK button component | https://design-system.service.gov.uk/components/button/ | "Disabled buttons have poor contrast and can confuse some users, so avoid them if possible." | verified | 2026-10-19 |
| S22 | web.dev, "SMS OTP form best practices" | https://web.dev/articles/sms-otp-form | `<input type=text inputmode=numeric autocomplete=one-time-code>`; uses a single input in its example; sample code auto-submits after a **WebOTP** fetch (SMS only, not email) | verified | 2026-10-19 |
| S23 | WCAG 2.2 Understanding 3.3.8 Accessible Authentication (Minimum) | https://w3c.github.io/wcag/understanding/accessible-authentication-minimum.html | "A service that requires manual transcription of a verification code is not compliant"; "it must be possible for a user to at least paste the code"; the example of six separate fields where "paste … only fills in one digit" is given as a failure | verified | 2026-10-19 |
| S24 | WCAG 2.2 Understanding 3.2.2 On Input + failure F36 | https://w3c.github.io/wcag/understanding/on-input.html | F36 is the failure of "automatically submitting a form and [presenting new content without prior warning] when the last field … is given a value". Avoid it with a submit button or by telling the user beforehand | verified | 2026-10-19 |
| S25 | OWASP Authentication Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html | Respond "in a generic manner" whether or not the account exists; equal processing time; throttle per account; beware lockout DoS | verified | 2026-10-19 |
| S26 | NN/g, "Passwordless Accounts: OTPs and Passkeys" (R. Budiu, 2023-06-25) | https://www.nngroup.com/articles/passwordless-accounts/ | Emailed codes cost an app switch; "risk that the email will be filtered out as spam"; on desktop an email code is easy to copy-paste | verified | 2026-10-19 |
| S27 | NN/g, "Checklist for Registration and Login Forms on Mobile" (R. Budiu, 2017-06-04) | https://www.nngroup.com/articles/checklist-registration-login/ | Offer social/Google login (faster, fewer errors); explain the benefits of registering; a code beats an email link | verified (summary of page) | 2026-10-19 |
| S28 | Baymard, "Save Account Creation for the Confirmation Step" (2023-09-19) | https://baymard.com/blog/delayed-account-creation | Early account prompts make guests abandon; prompt later. No content on social login | verified | 2026-10-19 |
| S29 | Apple HIG, Sign in with Apple | https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple | "Ask people to sign in only in exchange for value"; "Delay sign-in as long as possible"; "Make a Sign in with Apple button no smaller than other sign-in buttons, and avoid making people scroll to see the button"; titles: Sign in / Sign up / Continue with Apple; corner radius may match the app | verified | 2026-10-19 |
| S30 | Apple HIG, Managing accounts | https://developer.apple.com/design/human-interface-guidelines/managing-accounts | "write a brief, friendly description of the reasons for the requirement and its benefits. Display this message in your sign-in view"; a shopping app should require sign-in "only when they're ready to make a purchase"; "Always identify the authentication method you offer" | verified | 2026-10-19 |
| S31 | App Store Review Guidelines 4.8 | https://developer.apple.com/app-store/review/guidelines/ | An app that uses a third-party login (e.g. Google) for the primary account **must also offer** an equivalent privacy-preserving login (Sign in with Apple qualifies), unless it uses only its own account system | verified | 2026-10-19 |
| S32 | Google Identity branding guidelines | https://developers.google.com/identity/branding-guidelines | Text: "Sign in / Sign up / Continue with Google"; localisation "permitted and encouraged"; "displayed at least as prominently as other **third party** sign-in options"; do not alter the "G"; Light, Dark and Neutral themes | verified | 2026-10-19 |
| S33 | Google Identity Services, personalized button | https://developers.google.com/identity/gsi/web/guides/personalized-button | The button shows the returning user's name or email when a matching Google session exists. Not shown at width < 200 px or size medium/small | verified | 2026-10-19 |
| S34 | input-otp 1.5.0 (our dependency): docs and installed source | https://input-otp.rodz.dev/; `web/node_modules/input-otp/dist/index.mjs` | One real transparent `<input>` under visual slots, so paste and autofill go to one field. **Source: on paste, if the result fails `pattern`, the paste is silently dropped**; a `pasteTransformer` prop exists | verified | 2026-10-19 |
| S35 | Clerk "Last used" badge (2025-09-12); Better Auth `lastLoginMethod` plugin | https://clerk.com/changelog/2025-09-12-last-used-sign-in ; https://better-auth.com/docs/plugins/last-login-method | Auth vendors ship a "last used" badge on the matching sign-in option | verified (changelog/docs text); no usability data | 2026-10-19 |
| S36 | Practitioner write-ups on OTP boxes (Frontend Masters/Coyier citing Brad Frost; Cloud Four, Nov 2025; India UX4G) | frontendmasters.com/blog/html-css-for-a-one-time-password-input ; cloudfour.com/thinks/simple-one-time-passcode-inputs ; ux4g.gov.in/components/otp-input | Opinion is split. Most favour one real input, which may be styled as boxes. UX4G claims boxes are "35% faster" and cites no source | reported | 2026-10-19 |
| S37 | Our server, `server/internal/identity/identity.go`, `sign_in.go` | repo | Code lifetime 15 min, 5 attempts per code, **resend cooldown 60 s** (`codeCooldown = time.Minute`), 10 codes/hour; a new code ends earlier ones; the email calls it "**Mã đăng nhập**" and states the 15-minute validity; the answer is the same whether or not the address has an account | verified | 2026-10-19 |

## Findings by question

### 1. Vietnamese apps: identifier, social order, channel, code length, timer, wording
- **Identifier:** the phone number dominates. It is the only field on Grab, Shopee SMS, Tiki, Lazada OTP and Bách Hóa Xanh (verified, S1–S5). MoMo is SMS (S15). Email is a secondary link on Tiki ("Đăng nhập bằng email") and one option among several on Shopee. No Vietnamese app seen uses email as the only identifier. That is a deliberate difference for our pilot, since phone/SMS comes later.
- **Social order:** most put the identifier field and primary button first, then a "HOẶC"/"or" divider, then the social buttons: Shopee, Grab, Tiki, Uber (verified). Lazada is the exception and leads with social, Apple first (verified). Google sits second or first among the socials. The socials are outline buttons the same height as the primary on Grab and Shopee, icons only on Tiki.
- **Channel / length / timer:** Lazada uses a 6-character SMS code, "Nhận mã mới sau 60s" (verified, S3). MoMo says to resend after 30 s (verified help text, S15). Zalo-ZNS delivery is common among SMS gateways (reported). I found no primary evidence for which apps use it.
- **Wording seen:** "mã OTP" (MoMo, Shopee how-tos), "mã xác minh" (Uber VN), "Nhập mã 6 ký tự đã gửi về số …" and the "Xác minh" button (Lazada), "Tiếp tục"/"Tiếp Theo" for the identifier step everywhere.

### 2. Peers: passwordless email code
- Slack, Notion and Linear use an emailed code. Linear's email carries both a link and a code (verified, S9, S11, S12). TGTG reportedly uses a magic link (reported, S14).
- Layout: the email-first column with providers below appears on Slack, Vercel, Notion desktop, Uber and Airbnb (verified). Linear puts Google first as the filled primary and email second (verified).
- Desktop: either a centred column of about 320–400 px with no card (Vercel, Linear, Slack, Notion) or a card or modal over artwork (Airbnb about 480 px, Shopee 400 px), always with the logo. Chrome is minimal: logo, at most a "Sign up" link, footer legal links (verified).

### 3. Single field vs 6 boxes
- **The standard is a single input** (GOV.UK S18/S20, web.dev S22, verified). WCAG 3.3.8 says paste must work and names six real inputs, where paste fills one digit, as a failure (S23, verified).
- **Our input-otp is one real input drawn as boxes**, so it meets the rule in principle (S34, verified). But its source **silently drops a paste that fails `pattern`**. With `REGEXP_ONLY_DIGITS`, pasting "123456 ", "123 456" or a copy with a newline does nothing. GOV.UK says to "allow additional spaces, hyphens and dashes" (S18). So a common copy from a mail app can fail with no feedback. **Strong evidence, a real defect.**
- Boxes are common in Vietnam: Lazada uses six real inputs with no `autocomplete`, which is worse than ours (verified). The boxes themselves are fine as visuals.

### 4. Auto-submit on complete
- GOV.UK One Login, the closest analogue, does **not** auto-submit. It has a "Continue" button (S20, verified). WCAG F36 lists auto-submitting when the last field gets a value without prior warning as a 3.2.2 failure (S24, verified). web.dev auto-submits only for WebOTP, which is SMS-only and not our email case (S22).
- Auto-submit is widespread in apps (reported; I could not observe a peer's code step without submitting an address).
- Verdict: the evidence is moderate. Auto-submit plus a visible button is what most apps do, but it is the documented failure. The low-risk fix is to drop auto-submit for typed input and keep the button. If we keep auto-submit, a pasted or autofilled full code is the defensible case.

### 5. Wrong code: clear or keep
- GOV.UK One Login re-renders the field **empty** (no `value`, S20, verified) with the error above it and a link to request a new code. I found no research comparing clearing with keeping. **Weak evidence.** Clearing pairs well with paste/autofill retries. Keeping helps someone spot a single typo. Our current behaviour (clear, error under the boxes, focus back) is consistent with GOV.UK. Keep it, and make sure focus returns to the first slot and the error is announced.
- Copy: GOV.UK says "not correct, or may have expired, try entering it again or request a new code". Ours, "Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.", fits our server, where a new code ends the old one (S37).

### 6. Resend timer length and wording
- **Our UI waits 30 s, but our server refuses a new code for 60 s** (`codeCooldown = time.Minute`, S37, verified). So "Gửi lại mã" at 0:30 returns the "Bạn đã xin quá nhiều mã…" error. **This is a bug; set the UI to 60 s.** 60 s also matches Lazada (verified). MoMo's 30 s is for SMS (verified).
- Wording: Lazada's "Nhận mã mới sau 60s" vs ours, "Gửi lại mã sau 0:30". Both are fine. GOV.UK frames resend as a problem path ("Problems with the code?" / "Not received…?"). I found no evidence that one Vietnamese phrasing beats another.

### 7. Where the code was sent, and changing the address
- Show the full address in bold. That is GOV.UK S19 ("show the user the email address") and S20 ("We have sent an email to: **addr**"), verified. GOV.UK's rule not to reveal the number applies to 2FA phone codes, not to a passwordless identifier the user just typed.
- Offer a change. GOV.UK puts "use a different email address" inside "Problems with the code?" (S20). Our inline "Đổi email" after the sentence is equivalent and more visible. Keep it.

### 8. "Check spam"
- **The evidence supports one line.** GOV.UK One Login says "Your email might take a few minutes to arrive. If you do not get an email, check your spam folder." (S20, verified). NN/g names spam filtering as a known email-OTP risk (S26, verified). Slack's troubleshooting says to check spam (reported). Put it where the resend countdown is, so it reads as an action rather than filler, e.g. "Chưa thấy email? Xem trong thư rác (Spam). Gửi lại mã sau 0:58".

### 9. Helper text on the email step
- **The evidence does not support "Không cần mật khẩu" or "Chúng tôi gửi mã 6 số…".** No peer seen has such a line under the email field. Not GOV.UK, Vercel, Slack, Uber, Airbnb, Grab or Shopee SMS. Notion's helper is about work email, not the method (verified). The "Gửi mã" button already says what happens, and Apple's "Always identify the authentication method" is met by the button label (S30).
- What *is* supported is stating the **value / reason** (Apple HIG S29/S30; NN/g S27; DoorDash heading S8). Our heading "Đăng nhập để đặt món" already does that. The current `vi.json` has no helper line, which matches the evidence. An earlier build showed one.

### 10. Google vs email: order and look
- Google's rule covers only parity among **third-party** buttons (S32), and Apple's says Apple must be no smaller than other sign-in buttons (S29). Neither sets Google vs your own email.
- The pattern seen most is the identifier first, then a divider, then Google as a full-width outline button of equal height: 7 of 10 flows (Shopee, Grab, Tiki, Uber, Airbnb, Slack, Vercel). Google-first: Linear, Lazada (social first), Notion on phone. **Observational evidence only.**
- Arguments for Google first: one tap, no inbox switch (NN/g S26/S27), and the personalized "name/email" button for returning users (S33). Arguments for email first: Vietnamese convention, and it is the one method that always works (Google can fall back to the code, our "googleNeedsCode" state).
- This is a product choice. Both are defensible. Lean: **keep Google first** for speed, as now. Use Google's standard rendered button at full width (≥ 200 px so personalisation works) and the same height as "Gửi mã". The divider "hoặc dùng email" is fine.
- iOS: once Google is offered, App Store 4.8 requires Sign in with Apple or an equivalent (S31, verified), placed no smaller than Google (S29).

### 11. Primary button position on mobile
- Every flow observed puts the button **directly under the field**: Shopee, Grab, Tiki, Uber, Airbnb, Linear, Lazada OTP, GOV.UK (verified). None pins it to the bottom on the web. Keep it under the field.

### 12. Headings
- Code step: "Check your email" (GOV.UK S20) matches our "Kiểm tra email của bạn". Keep it.
- Email step: action-specific value headings are supported (Apple S29/S30; DoorDash S8). Our sign-in is shown for both ordering and following, so the heading should follow the action ("…để đặt món" / "…để theo dõi quán"). That inference is mine, not from a source.
- "Đăng nhập hoặc đăng ký" (Airbnb, Tiki) tells new people they need no separate sign-up (verified). We create the account on first sign-in, so consider "Đăng nhập" → "Đăng nhập / Đăng ký" in the top bar. Moderate evidence.

### 13. Desktop presentation
- Peers use 320–480 px, centred, with the logo (S7, S9–S12, verified). Our 440 px card with the logo in the top bar fits that range. I found no evidence for card vs no card. Keep the card.

### 14. Returning the user to their context
- Return straight to the page that asked: GOV.UK One Login's copy is built around "go back to the service you were trying to use" (S20), and Apple says to sign in "only when ready to purchase" (S30). I found **no** peer with a "you'll go back to…" card. The action-specific heading (§12) carries the context. No extra card.

### 15. Remembering the last method or email
- Auth vendors ship a "last used" badge (Clerk, Better Auth, S35). There is no usability data. Grab offers "Lưu thông tin trên thiết bị này trong 60 ngày" (verified). Google's personalized button already shows the returning Google account (S33). Browser autofill (`autocomplete=email`) already remembers the address.
- Weak evidence. At most, a small "Lần trước" badge on the last-used method, stored client-side. Not needed for the pilot.

### 16. Account enumeration
- OWASP: give the same response whether or not the account exists (S25). Our server already does (S37), and the code-step copy says "Mã 6 số đã gửi đến X" for any address. Good.
- The **Google-link-required** state ("Email này đã có tài khoản") does reveal that an account exists. It is shown only after the person proved control of that Google address, so the risk is low but real. Note it in the design rather than change it.

### 17. Vietnamese wording
- "mã OTP" is the most familiar term (MoMo, Shopee how-tos, verified/reported). "mã xác minh" is used by Uber and Shopee help (verified/reported). "mã xác thực" appears in gateway and Sapo copy (reported). **Our own email says "Mã đăng nhập"** (S37), so the screen should use the same word the email shows.
- "Mã 6 số" is clear and concrete. Lazada says "mã 6 ký tự". Keep "mã 6 số" as the descriptor and "mã đăng nhập" as the name. Avoid "OTP" in our own copy for older users, who may not know the acronym. That last point is my inference; no source tested it.

## Recommended changes (each with evidence; weak evidence is flagged)

1. **Set the resend wait to 60 s, matching the server cooldown.** At 30 s the user gets a "too many codes" error. Evidence: our code (S37); Lazada 60 s (S3). *Strong; this is a bug.*
2. **Strip non-digits on paste** with `pasteTransformer={(s) => s.replace(/\D/g, "")}` (and the same on autofill/`onChange`, if needed). Today input-otp silently drops a paste containing a space or newline. Evidence: S34 (source), S18 (allow spaces), S23 (paste must work). *Strong.*
3. **Stop auto-submitting typed codes.** Keep "Xác nhận" as the submit, or auto-submit only when the full code arrives in one paste or autofill event. Evidence: S20 (GOV.UK One Login has no auto-submit), S24 (F36). *Moderate; common industry practice goes the other way.*
4. **Don't disable "Xác nhận" while the code is short.** Leave it enabled and validate with "Nhập đủ 6 số" (GOV.UK: "Enter the code using only 6 digits"). Evidence: S21, S20. *Moderate.*
5. **Add one delivery/spam line next to the resend control** on the code step. Proposed: "Chưa thấy email? Xem trong thư rác (Spam)." placed with "Gửi lại mã sau 0:59". Evidence: S20, S26. *Moderate.*
6. **Name the code as the email does.** The email says "Mã đăng nhập", so use "Mã đăng nhập 6 số đã gửi đến **X**." and label it "Mã đăng nhập (6 số)". Evidence: S37 (consistency); terms from S3/S6/S15. *Weak on the exact term, sound on consistency.*
7. **No helper line under the email field.** The current `vi.json` is right. Evidence: §9 (no peer has one; the button label names the method). *Moderate.*
8. **Make the heading follow the action** (order vs follow), and consider "Đăng nhập / Đăng ký" in the top bar so new people know no separate sign-up exists. Evidence: S29, S30, S8, S7, S4. *Moderate (heading); weak (top bar).*
9. **Keep:** the button under the field; the full address in bold with an inline "Đổi email"; clearing on a wrong code (weak evidence either way); the 440 px desktop card; the return to `returnTo` with no extra card; enumeration-safe copy. Evidence: §§7, 11, 13, 14, 16.
10. **Google button:** keep it as Google's rendered button at full width (≥ 200 px, so the personalized "returning account" variant can show) and the same height as "Gửi mã". Order (Google first or email first) is a product call with only observational evidence. Lean: Google first. Evidence: S32, S33, §10.
11. **iOS (later):** shipping Google sign-in in the iOS app requires Sign in with Apple or an equivalent, no smaller than Google and visible without scrolling. Evidence: S31, S29. *Strong (store rule).*
12. **Optional, not for the pilot:** a "Lần trước" badge on the last-used method. Evidence: S35. *Weak.*

## Gaps
- I could not see any peer's code-entry screen (Slack, Notion, Linear, Grab, Shopee) without submitting an address. Their auto-submit, clearing and timer behaviour is unverified.
- I found no primary source for the code steps of ShopeeFood, Be, Zalo, Highlands or Phúc Long.
- I found no NN/g or Baymard study on separate boxes vs a single field, or on auto-submit.
