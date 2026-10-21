// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Second Bite';

  @override
  String get homeTitle => 'Tonight at Tasco Mall';

  @override
  String get homePlace => 'Tasco Mall';

  @override
  String get homeArea => 'Long Biên, Hanoi';

  @override
  String get homeSearchLabel => 'Search dishes or sellers';

  @override
  String get homeSearchPlaceholder => 'Search pastries, rolls, vegetables…';

  @override
  String get homeKindsLabel => 'Kinds of food';

  @override
  String get homeCollectNow => 'Collect now';

  @override
  String get homeDealsTitle => 'Good bags tonight at Tasco Mall';

  @override
  String get homeUpTo => 'Up to';

  @override
  String homeUpToPercent(int percent) {
    return '$percent%';
  }

  @override
  String homeTicketWindow(String from) {
    return 'Collect $from';
  }

  @override
  String homeOpenBags(int bags, String last) {
    String _temp0 = intl.Intl.pluralLogic(
      bags,
      locale: localeName,
      other: '$bags bags',
      one: '1 bag',
    );
    return '$_temp0 open · last collection at $last';
  }

  @override
  String get homeClosingSoon => 'Closing soon';

  @override
  String get homeSeeAll => 'See all';

  @override
  String get homeAllOffers => 'Around you at Tasco Mall';

  @override
  String get homeResults => 'Results';

  @override
  String get homeEmpty => 'Nothing has been posted for tonight yet.';

  @override
  String get homeEmptyFiltered => 'Nothing matches this filter.';

  @override
  String get homeShowAll => 'See every dish';

  @override
  String get homeLoading => 'Loading dishes…';

  @override
  String offerStock(int units) {
    return '$units left';
  }

  @override
  String get offerSoldOut => 'Sold out';

  @override
  String offerWindow(String from, String until) {
    return 'Collect $from–$until';
  }

  @override
  String offerWindowAt(String from, String until, String place) {
    return '$from–$until · $place';
  }

  @override
  String offerDiscount(int percent) {
    return '-$percent%';
  }

  @override
  String offerDiscountLabel(int percent) {
    return '$percent% off';
  }

  @override
  String offerOriginalPrice(String price) {
    return 'Was $price';
  }

  @override
  String offerKind(String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'bakery': 'Bakery',
      'prepared_food': 'Cooked food',
      'ingredients': 'Ingredients',
      'drinks': 'Drinks',
      'mixed_box': 'Mixed box',
      'other': 'Other',
    });
    return '$_temp0';
  }

  @override
  String get introTitle => 'What is Second Bite?';

  @override
  String get introBody =>
      'Good food left at the end of the day by sellers in Tasco Mall, at a lower price. Order ahead, then collect it at the counter within the dish\'s window.';

  @override
  String get introDismiss => 'Close the introduction';

  @override
  String get languageSwitch => 'Chuyển sang tiếng Việt';

  @override
  String get errorTitle => 'Something went wrong';

  @override
  String get errorOffline =>
      'Could not connect. Check your connection and try again.';

  @override
  String get errorBody =>
      'Please try again. If it keeps failing, tell us the reference below.';

  @override
  String errorReference(String reference) {
    return 'Reference: $reference';
  }

  @override
  String get errorRetry => 'Try again';

  @override
  String get navLabel => 'Main navigation';

  @override
  String get navHome => 'Home';

  @override
  String get navOrders => 'My orders';

  @override
  String get navSaved => 'Saved';

  @override
  String get navAccount => 'Account';

  @override
  String get navSoon => '(coming soon)';

  @override
  String get accountTitle => 'Account';

  @override
  String get accountGuestTitle => 'You are not signed in';

  @override
  String get accountGuestBody => 'Sign in to order and follow your orders.';

  @override
  String get legalLabel => 'Legal';

  @override
  String get legalTerms => 'Terms of use';

  @override
  String get legalPrivacy => 'Privacy policy';

  @override
  String get legalDraft =>
      'Draft, waiting for review by the founder and a lawyer. It may change before Second Bite opens to everyone; the parts marked “to be added” will be filled in.';

  @override
  String legalUpdated(DateTime date) {
    final intl.DateFormat dateDateFormat = intl.DateFormat.yMMMMd(localeName);
    final String dateString = dateDateFormat.format(date);

    return 'Last updated: $dateString';
  }

  @override
  String get legalContents => 'Sections';

  @override
  String get legalTermsIntro =>
      'These terms are the agreement between you and Second Bite when you use Second Bite\'s website and app, as a customer or as a seller.';

  @override
  String get legalTermsSection1Title => '1. What Second Bite is';

  @override
  String get legalTermsSection1Body =>
      'Second Bite is a non-profit platform connecting shops with end-of-day surplus to customers who want it at a lower price. Second Bite takes no commission on a shop\'s sales.\n\nOperator: to be added (name, address, registration and licence if any).\n\nThe sale of food is between the customer and the shop. Second Bite provides the place to post, find and order; it neither sells nor inspects food.';

  @override
  String get legalTermsSection2Title => '2. Accounts';

  @override
  String get legalTermsSection2Body =>
      'You can browse and search without an account. You sign in to order, to follow a shop, or to post for a shop.\n\nKeep the mailbox and Google account you sign in with secure, and do not sign in for someone else.';

  @override
  String get legalTermsSection3Title => '3. Sellers\' responsibilities';

  @override
  String get legalTermsSection3Body =>
      'Post only genuine surplus, never food still needed for normal service.\n\nDescribe the food, quantity, original price and price truthfully; the price must be at least Second Bite\'s minimum discount below the original price (20% at present).\n\nYou are responsible for the food\'s quality, safety and allergen information, and for checking it at the handover.\n\nPhotos and text you post must be yours or yours to use; you allow Second Bite to show them on the platform.';

  @override
  String get legalTermsSection4Title => '4. Customers\' responsibilities';

  @override
  String get legalTermsSection4Body =>
      'Collect within the dish\'s window; an order not collected may be recorded and affect later orders.\n\nRead the description, especially allergen information, and ask the shop when unsure. Surplus food may differ slightly from its photo.\n\nEach person may order a limited number of items a day, so surplus reaches more people.';

  @override
  String get legalTermsSection5Title => '5. Prices, payment and cancellation';

  @override
  String get legalTermsSection5Body =>
      'Prices shown are the shop\'s; third-party fees, if any, are shown separately before you order.\n\nDuring the pilot, you pay the shop directly when you collect. Cancellation and refunds: to be added when ordering opens.';

  @override
  String get legalTermsSection6Title => '6. What is not allowed';

  @override
  String get legalTermsSection6Body =>
      'Posting false, unlawful or someone else\'s content; ordering without meaning to collect; interfering with the system or using someone else\'s account.\n\nSecond Bite may hide a dish, or suspend a shop or an account that breaks these terms.';

  @override
  String get legalTermsSection7Title => '7. Limits of liability';

  @override
  String get legalTermsSection7Body =>
      'Second Bite works to keep the service running but does not promise it is always available. To the extent the law allows, Second Bite is not responsible for the quality of food a shop sells; complaints about food go to the shop, and Second Bite helps both sides resolve them.';

  @override
  String get legalTermsSection8Title => '8. Changes and governing law';

  @override
  String get legalTermsSection8Body =>
      'When these terms change, we update the date at the top and tell you beforehand if a change affects your rights.\n\nThese terms are governed by Vietnamese law. Disputes are first settled by negotiation, then as the law provides.\n\nContact: to be added.';

  @override
  String get legalPrivacyIntro =>
      'Second Bite is a non-profit platform that helps shops sell their end-of-day surplus at a lower price. This page says what personal data we collect, why, how long we keep it, who can see it and what your rights are, under Vietnam\'s Personal Data Protection Law 2025 and Decree 52/2013/NĐ-CP.';

  @override
  String get legalPrivacySection1Title => '1. Who is responsible for your data';

  @override
  String get legalPrivacySection1Body =>
      'Data controller: to be added (name of the organisation or person, address).\n\nPrivacy contact: to be added.';

  @override
  String get legalPrivacySection2Title => '2. What we collect and why';

  @override
  String get legalPrivacySection2Body =>
      'Browsing and searching need no account. When you search around a place, it is used only to work out distances for that search and is not stored.\n\nAccount: your email address, to send you sign-in codes and recognise you next time; a display name, so the shop can call you at the handover.\n\nSigning in with Google (coming soon): your Google identifier, email address, name and profile picture, which Google shares when you agree, to sign you in and show your name.\n\nSign-in session: a random token that keeps you signed in; we store only its hash and when it was last used.\n\nSellers: the shop\'s name, address, map location and phone, and the email addresses of its owner and staff, so the shop can post and customers can find it.\n\nPhotos: dish and shop photos uploaded by sellers. Each is written again in two sizes without any embedded information such as where it was taken or the camera.\n\nOrders (coming soon): dishes, quantities, collection time and status, so the shop can prepare them and each person\'s daily limit can be kept.\n\nEmails sent: recipient, kind of email and the provider\'s message id, to know whether an email arrived.\n\nTechnical logs: the time, path and result of each request, to find and fix faults; they never hold email addresses, codes or passwords.';

  @override
  String get legalPrivacySection3Title => '3. How long we keep it';

  @override
  String get legalPrivacySection3Body =>
      'Sign-in codes: deleted once used, when a newer one is requested, or a day after they were sent at the latest.\n\nSessions: end after 30 days without use; deleted when you sign out.\n\nPhotos uploaded but never used for a dish or a shop: deleted after a day.\n\nAccounts, shops, posted dishes and orders: kept until you delete your account or ask us to delete them, except what the law requires us to keep longer.\n\nWhen you delete your account: the account, its sessions, its Google link, sign-in codes and the record of the emails we sent you are deleted at once; your place in shops and the photos you never used go within minutes. Posted dishes, their photos and shop photos belong to the shop and stay, no longer linked to you; a shop you own is closed.';

  @override
  String get legalPrivacySection4Title => '4. Who can see your data';

  @override
  String get legalPrivacySection4Body =>
      'Sellers see your display name and your orders with their shop, never your email address. Customers see a shop\'s and its dishes\' public details.\n\nSecond Bite\'s admins see data when operating and supporting the service requires it.\n\nProcessors acting for us: our hosting provider (Amazon Web Services; server location: to be added), our email provider (Brevo), and Google when you choose to sign in with Google. If data is kept outside Vietnam, we will say so here.\n\nWe do not sell your data or use it for advertising.';

  @override
  String get legalPrivacySection5Title => '5. Your rights';

  @override
  String get legalPrivacySection5Body =>
      'You may know about, see, correct and ask us to delete your data; withdraw your consent; ask us to restrict processing; and complain, under the Personal Data Protection Law 2025.\n\nYou can delete your account yourself in the app (Account → Account settings → Delete account) or on the web at /delete-account, after typing the code we email to the account\'s address.\n\nYou can change your display name yourself. For anything else, write to the contact in section 1; we answer within the time the law sets, and if we cannot delete something for a legitimate reason, we tell you why.';

  @override
  String get legalPrivacySection6Title => '6. Cookies and browser storage';

  @override
  String get legalPrivacySection6Body =>
      'A session cookie (coming soon), to keep you signed in.\n\nA language cookie, remembering Vietnamese or English for a year.\n\nA mark in the browser\'s storage, remembering that you closed the introduction.\n\nWe use no advertising cookies and no third-party tracking.';

  @override
  String get legalPrivacySection7Title => '7. Protecting your data';

  @override
  String get legalPrivacySection7Body =>
      'Connections are encrypted; sign-in codes and sessions are stored only as hashes; access is checked on the server for every request. If a breach occurs, we will notify as the law requires.';

  @override
  String get legalPrivacySection8Title => '8. Children';

  @override
  String get legalPrivacySection8Body =>
      'Second Bite is for people aged 16 and over. If you are younger, use it with a parent or guardian.';

  @override
  String get legalPrivacySection9Title => '9. Changes to this policy';

  @override
  String get legalPrivacySection9Body =>
      'When the policy changes, we update the date at the top and tell you before a change that affects your rights takes effect.';

  @override
  String get notFoundTitle => 'This page could not be found';

  @override
  String get notFoundBack => 'Back to home';

  @override
  String get topBarBack => 'Back';

  @override
  String get accountSignIn => 'Sign in';

  @override
  String accountMenu(String email) {
    return 'Account $email';
  }

  @override
  String accountSignedInAs(String email) {
    return 'Signed in as $email';
  }

  @override
  String get accountSignOut => 'Sign out';

  @override
  String get accountSignedIn => 'Signed in';

  @override
  String get signInTitle => 'Sign in';

  @override
  String get signInHeading => 'Sign in to order';

  @override
  String get signInOr => 'or use your email';

  @override
  String get signInGoogle => 'Continue with Google';

  @override
  String get signInEmailLabel => 'Email';

  @override
  String get signInEmailPlaceholder => 'name@gmail.com';

  @override
  String get signInSendCode => 'Send code';

  @override
  String get signInSendCodeHere => 'Send a code to this address';

  @override
  String get signInSending => 'Sending the code…';

  @override
  String signInLegal(String terms, String privacy) {
    return 'By continuing, you agree to the $terms and the $privacy.';
  }

  @override
  String get signInCodeHeading => 'Check your email';

  @override
  String signInCodeSent(String email) {
    return 'We sent a 6-digit sign-in code to $email.';
  }

  @override
  String get signInChangeEmail => 'Change email';

  @override
  String get signInCodeLabel => 'The 6-digit sign-in code';

  @override
  String get signInConfirm => 'Confirm';

  @override
  String get signInConfirming => 'Confirming…';

  @override
  String signInResendIn(String time) {
    return 'Send a new code in $time';
  }

  @override
  String get signInResend => 'Send a new code';

  @override
  String get signInGoogleNeedsCodeTitle =>
      'This address already has an account';

  @override
  String signInGoogleNeedsCodeBody(String email) {
    return '$email already has a Second Bite account. Get a code at this address to sign in.';
  }

  @override
  String get signInGoogleNeedsCodeBodyNoAddress =>
      'This Google account\'s address already has a Second Bite account. Get a code by email to sign in.';

  @override
  String get signInFailed => 'You could not be signed in. Please try again.';

  @override
  String get signInNotArrived => 'No email yet? Check your spam folder.';

  @override
  String get deleteAccountTitle => 'Delete your account';

  @override
  String get deleteAccountIntro =>
      'You can delete your Second Bite account at any time, in the app or on this page. Deleting it is permanent and cannot be undone.';

  @override
  String get deleteAccountDeletedTitle => 'Deleted as soon as you confirm';

  @override
  String get deleteAccountDeleted1 =>
      'Your account: your email address and display name.';

  @override
  String get deleteAccountDeleted2 =>
      'Every session on every device, and the link to your Google account.';

  @override
  String get deleteAccountDeleted3 =>
      'Sign-in codes and the record of the emails we sent you.';

  @override
  String get deleteAccountLaterTitle => 'Deleted within a few minutes';

  @override
  String get deleteAccountLater1 => 'Your place as a seller\'s owner or staff.';

  @override
  String get deleteAccountLater2 =>
      'Photos you uploaded that no dish or seller uses.';

  @override
  String get deleteAccountKeptTitle => 'Kept, no longer linked to you';

  @override
  String get deleteAccountKept1 =>
      'Dishes posted, their photos and sellers\' photos: they belong to the seller.';

  @override
  String get deleteAccountKept2 =>
      'Orders and payments the law requires us to keep, once ordering opens; how long is to be added.';

  @override
  String get deleteAccountOwnerTitle => 'You own a seller';

  @override
  String deleteAccountOwnerBody(String sellers) {
    return 'Deleting your account closes $sellers: it stops showing to customers and its staff can no longer manage it, until Second Bite steps in.';
  }

  @override
  String get deleteAccountSignedOutTitle => 'Sign in to delete your account';

  @override
  String get deleteAccountSignedOutBody =>
      'To be sure the account is yours, you sign in, then type the code we email to the account\'s address.';

  @override
  String get deleteAccountSendCode => 'Send the code';

  @override
  String get deleteAccountSending => 'Sending the code…';

  @override
  String deleteAccountConfirmBody(String email) {
    return 'We will email a six-digit code to $email to confirm that you want to delete your account.';
  }

  @override
  String get deleteAccountFinal =>
      'Once you enter the right code, the account is deleted at once and cannot be undone.';

  @override
  String get deleteAccountOwnedFailed =>
      'Your sellers could not be read, so we cannot yet tell you which close with your account. Try again before the code is sent.';

  @override
  String get deleteAccountRetry => 'Try again';

  @override
  String get deleteAccountCodeHeading => 'Enter the code';

  @override
  String deleteAccountCodeSent(String email) {
    return 'A six-digit code was sent to $email. It only deletes the account.';
  }

  @override
  String get deleteAccountCodeLabel => 'Six-digit confirmation code';

  @override
  String get deleteAccountConfirm => 'Delete my account for good';

  @override
  String get deleteAccountDeleting => 'Deleting…';

  @override
  String get deleteAccountCancel => 'Keep my account';

  @override
  String get deleteAccountFailed =>
      'Your account could not be deleted. Please try again.';

  @override
  String get deleteAccountDoneTitle => 'Your account is deleted';

  @override
  String get deleteAccountDoneBody =>
      'Your account and your personal data are deleted. You can still sign in with this address at any time, as a new account.';

  @override
  String get deleteAccountHome => 'Back to home';

  @override
  String get accountSettingsTitle => 'Account settings';

  @override
  String get accountSettingsDetails => 'Account details';

  @override
  String get accountSettingsEmail => 'Email';

  @override
  String get accountSettingsDisplayName => 'Display name';

  @override
  String get accountSettingsNoDisplayName => 'Not set';

  @override
  String get accountSettingsSellers => 'Your shops';

  @override
  String get accountSettingsOwner => 'Owner';

  @override
  String get accountSettingsStaff => 'Staff';

  @override
  String get accountSettingsLanguage => 'Language';

  @override
  String get accountSettingsLanguageName => 'English';

  @override
  String get accountSettingsDeleteTitle => 'Delete your account';

  @override
  String get accountSettingsDeleteBody =>
      'Permanently delete your account and your personal data. This cannot be undone; a shop you own will be closed.';

  @override
  String get accountSettingsDeleteAction => 'Delete account';

  @override
  String problemReference(String reference) {
    return 'Reference: $reference';
  }

  @override
  String get accountSettingsEditName => 'Edit the display name';

  @override
  String get accountSettingsSave => 'Save';

  @override
  String get accountSettingsSaving => 'Saving…';

  @override
  String get accountSettingsCancel => 'Cancel';

  @override
  String get accountSettingsNameFailed =>
      'The name was not saved. Try again in a few minutes.';
}
