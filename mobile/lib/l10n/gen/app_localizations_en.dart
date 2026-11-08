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
  String get homeArea => 'Long Biên, Hanoi';

  @override
  String get homeSearchLabel => 'Search dishes or sellers';

  @override
  String get homeSearchPlaceholder => 'Search pastries, fried chicken, pizza…';

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
      'dessert': 'Dessert',
      'snacks': 'Snacks',
      'produce': 'Produce',
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
      'You can browse, search and order without an account; when you order, you give the shop the name and phone number of whoever collects. You sign in to follow a shop or to post for a shop.\n\nKeep the mailbox and Google account you sign in with secure, and do not sign in for someone else.';

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
      'Sign-in codes: deleted once used, when a newer one is requested, or a day after they were sent at the latest.\n\nSessions: end after 30 days without use; deleted when you sign out.\n\nPhotos uploaded but never used for a dish or a shop: deleted after a day.\n\nAccounts, shops, posted dishes and orders: kept until you delete your account or ask us to delete them, except what the law requires us to keep longer.\n\nWhen you delete your account: the account, its sessions, its Google link, sign-in codes and the record of the emails we sent you are deleted at once; your place in shops and the photos you never used go within minutes. Posted dishes, their photos and shop photos belong to the shop and stay, no longer linked to you; a shop you own is closed. Your orders: your name, phone number and consent to Zalo are taken off them, and the chats with the shop are deleted; the shop keeps the order number, dishes, amount and status for its records, no longer linked to you.';

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
      'A session cookie (coming soon), to keep you signed in.\n\nA language cookie, remembering Vietnamese or English for a year.\n\nA place cookie, remembering the area you chose (a point rounded to about 100 m and its name) for 180 days; choose “All shops” to clear it.\n\nA mark in the browser\'s storage, remembering that you closed the introduction.\n\nWe use no advertising cookies and no third-party tracking.';

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
      'Orders: the number, dishes, amount and status, for the shop\'s records; your name, phone number and consent to Zalo are taken off them, and the chats with the shop are deleted.';

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

  @override
  String sellerWindow(String from, String until) {
    return 'Collect today $from–$until';
  }

  @override
  String get sellerDirections => 'Directions ›';

  @override
  String get sellerKinds => 'Kinds of dish';

  @override
  String get sellerOnSale => 'On sale';

  @override
  String get sellerTonight => 'On sale tonight';

  @override
  String get sellerNothing => 'This shop has nothing on sale tonight';

  @override
  String get sellerHome => 'See other dishes';

  @override
  String sellerNoMatch(String q) {
    return 'No dish matches “$q”';
  }

  @override
  String get sellerShare => 'Share this shop';

  @override
  String sellerSearch(String seller) {
    return 'Search the $seller menu';
  }

  @override
  String get dishAbout => 'About this dish';

  @override
  String dishWeight(int grams) {
    return 'About $grams g.';
  }

  @override
  String get dishNotes => 'Good to know';

  @override
  String get dishBringBag => 'Bring your own bag or box.';

  @override
  String get dishAskSeller => 'Ask the shop about ingredients and allergies.';

  @override
  String get dishSellerAnswers =>
      'Second Bite only connects you with the shop; the shop is responsible for the quality and food safety of the dish.';

  @override
  String get dishTerms => 'Terms';

  @override
  String dishCount(int count, String name) {
    return '$count $name to add';
  }

  @override
  String dishAdd(String price) {
    return 'Add to cart · $price';
  }

  @override
  String dishAllChosen(int units) {
    return 'All $units chosen';
  }

  @override
  String cartAdd(String name) {
    return 'Add one $name';
  }

  @override
  String cartRemove(String name) {
    return 'Remove one $name';
  }

  @override
  String cartQuantity(int quantity, String name) {
    return '$quantity $name in the cart';
  }

  @override
  String cartSummary(int units, String saved) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$_temp0 · save $saved';
  }

  @override
  String cartPortionsLeft(int units) {
    return '$units left';
  }

  @override
  String cartPortionsChosen(int units) {
    return 'all $units chosen';
  }

  @override
  String cartPortionsCapped(int units) {
    return 'at most $units per order';
  }

  @override
  String dishCapChosen(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return 'Chosen the most per order: $_temp0';
  }

  @override
  String dishPerOrder(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return 'At most $_temp0 per order';
  }

  @override
  String get cartTitle => 'Confirm order';

  @override
  String get cartClose => 'Close';

  @override
  String get cartOpen => 'View cart';

  @override
  String get cartEmpty => 'Your cart is empty';

  @override
  String get cartBrowse => 'See tonight\'s dishes';

  @override
  String get cartDirections => 'Directions';

  @override
  String cartSellerWindow(String place, String from, String until) {
    return '$place · Collect $from – $until';
  }

  @override
  String get cartOver => 'Pickup time is over';

  @override
  String cartDropLabel(String name) {
    return 'Remove $name from the cart';
  }

  @override
  String get cartPay => 'Payment';

  @override
  String get cartCounter => 'Pay at the counter';

  @override
  String get cartTransfer => 'Bank transfer';

  @override
  String get cartSoon => '(coming soon)';

  @override
  String cartSummaryTitle(int orders) {
    String _temp0 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: 'Total · $orders orders',
      one: 'Total',
    );
    return '$_temp0';
  }

  @override
  String cartDishes(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return 'Dishes ($_temp0)';
  }

  @override
  String get cartTotal => 'Total';

  @override
  String get cartCancelTitle => 'Cancellation policy';

  @override
  String get cartCancelBody =>
      'You can cancel until the seller marks the food ready.';

  @override
  String cartTotalSummary(int orders, int units, String saved) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    String _temp1 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    String _temp2 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: '$orders orders · $_temp0',
      one: '$_temp1 in all',
    );
    return '$_temp2 · save $saved';
  }

  @override
  String cartOrder(int orders) {
    String _temp0 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: 'Place $orders orders',
      one: 'Place order',
    );
    return '$_temp0';
  }

  @override
  String get cartContactTitle => 'Who collects';

  @override
  String get cartContactHint =>
      'The seller calls this name when you arrive and rings this number if needed.';

  @override
  String get cartNameLabel => 'Name';

  @override
  String get cartPhoneLabel => 'Phone number';

  @override
  String get cartNameInvalid => 'Give a name of 1 to 50 characters.';

  @override
  String get cartPhoneInvalid =>
      'Give a 10-digit phone number starting with 0.';

  @override
  String get cartContactSubmit => 'Continue';

  @override
  String get cartConfirmTitle => 'Place the order with the phone number';

  @override
  String get cartConfirmYes => 'Yes, order';

  @override
  String get cartConfirmEdit => 'Edit';

  @override
  String cartGoneOne(String name) {
    return '$name just sold out';
  }

  @override
  String cartGoneMany(int count) {
    return '$count dishes just sold out';
  }

  @override
  String get cartGoneBody =>
      'Someone else just ordered the last portions. You have not been charged.';

  @override
  String cartFewerOne(String name, int left) {
    return 'Only $left of $name left';
  }

  @override
  String cartFewerMany(int count) {
    return '$count dishes have fewer portions left';
  }

  @override
  String get cartFewerBody =>
      'Someone else just ordered first. You have not been charged.';

  @override
  String cartOrderRest(String what, String price) {
    return 'Order $what · $price';
  }

  @override
  String cartLine(int quantity, String name) {
    return '$quantity× $name';
  }

  @override
  String cartRestUnits(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: 'the $units portions left',
      one: 'the 1 portion left',
    );
    return '$_temp0';
  }

  @override
  String get cartOtherDishes => 'See the seller\'s other dishes';

  @override
  String get cartOrderFailedPlain =>
      'The order did not go through. Check your connection and try again.';

  @override
  String cartPromotionRule(String rule, String amount) {
    return '$rule: $amount off';
  }

  @override
  String cartPromotionRuleFrom(String rule, String amount, String from) {
    return '$rule: $amount off orders from $from';
  }

  @override
  String cartPromotionPercent(int value, String max) {
    return '$value% (up to $max)';
  }

  @override
  String cartPromotionPerDay(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Each phone number gets it $count times a day.',
      one: 'Each phone number gets it once a day.',
    );
    return '$_temp0';
  }

  @override
  String get cartPromotionAfter =>
      'The order shows what was taken off once you place it; you pay less at the counter.';

  @override
  String get ordersTitle => 'My orders';

  @override
  String get ordersLists => 'Order lists';

  @override
  String ordersTabOpen(int count) {
    return 'To collect ($count)';
  }

  @override
  String get ordersTabEnded => 'Done';

  @override
  String get ordersNoneOpen => 'You have no orders to collect.';

  @override
  String get ordersNoneEnded => 'No finished orders yet.';

  @override
  String ordersReadyUntil(String until) {
    return 'Ready · until $until';
  }

  @override
  String get ordersPreparing => 'Preparing';

  @override
  String ordersCardMetaWindow(
    String number,
    String total,
    String from,
    String until,
  ) {
    return '#$number · $total · collect $from–$until';
  }

  @override
  String ordersCardMetaReady(String number, String total) {
    return '#$number · $total · pay when you collect';
  }

  @override
  String get ordersSeeQr => 'Show the QR code';

  @override
  String get ordersSeeOrder => 'See order';

  @override
  String get ordersDayToday => 'Today';

  @override
  String get ordersDayWeek => 'This week';

  @override
  String get ordersDayBefore => 'Earlier';

  @override
  String ordersDate(int day, int month) {
    return '$day/$month';
  }

  @override
  String get ordersEndedLineConfirmed => 'Confirmed';

  @override
  String get ordersEndedLineReady => 'Ready';

  @override
  String get ordersEndedLineCollected => 'Collected';

  @override
  String get ordersEndedLineCancelled => 'Cancelled · nothing charged';

  @override
  String get ordersEndedLineRefused => 'Turned down · nothing charged';

  @override
  String get ordersEndedLineExpired => 'Expired, not collected';

  @override
  String get ordersSignInTitle => 'No orders here yet';

  @override
  String get ordersSignInBody =>
      'No order was placed in this app. If you ordered while signed in, sign in to see it.';

  @override
  String orderNumber(String number) {
    return 'Order #$number';
  }

  @override
  String get orderHeadlineConfirmed => 'Confirmed · the shop is preparing it';

  @override
  String get orderHeadlineReady => 'Ready to collect';

  @override
  String orderOpensIn(String left) {
    return 'Collect today · opens in $left';
  }

  @override
  String orderClosesIn(String left) {
    return 'Collect today · $left left';
  }

  @override
  String orderHoursMinutes(int hours, int minutes) {
    return '$hours h $minutes min';
  }

  @override
  String orderMinutes(int minutes) {
    return '$minutes min';
  }

  @override
  String orderCounterToday(String address, String from, String until) {
    return '$address · $from–$until today';
  }

  @override
  String orderUnits(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$_temp0';
  }

  @override
  String get orderCollectReady =>
      'Show the QR code at the counter, or give your name and phone number.';

  @override
  String get orderCollectLater =>
      'The QR code shows once your food is ready. You can also give your name and phone number.';

  @override
  String orderQrLabel(String number) {
    return 'QR code to collect order #$number';
  }

  @override
  String orderPlacedWith(String seller) {
    return 'Ordered together: $seller';
  }

  @override
  String get orderHowTitle => 'How to collect';

  @override
  String get orderHowGoTitle => 'Go to the till';

  @override
  String get orderHowQrTitle => 'Show the QR code';

  @override
  String get orderHowQrBody => 'or give your name and number';

  @override
  String get orderHowTakeTitle => 'Take your food';

  @override
  String get orderHowTakeBody => 'Bring your own bag';

  @override
  String get orderStepsLabel => 'Order steps';

  @override
  String get orderStepPlaced => 'Placed';

  @override
  String get orderStepPreparing => 'Preparing';

  @override
  String get orderStepReady => 'Ready';

  @override
  String get orderStepCollected => 'Done';

  @override
  String orderOrdered(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return 'Ordered · $_temp0';
  }

  @override
  String get orderOriginalPrice => 'Original price';

  @override
  String get orderFactSaved => 'Saved';

  @override
  String orderFactSavedValue(String saved) {
    return '$saved on the original prices';
  }

  @override
  String get orderFactTotal => 'Total';

  @override
  String get orderFactPayAtCounter => 'Pay at the counter';

  @override
  String get orderFactBeforeDiscount => 'Price before the discount';

  @override
  String get orderFactNumber => 'Order number';

  @override
  String get orderFactPayment => 'Payment';

  @override
  String get orderFactAtCounter => 'Pay at the counter';

  @override
  String get orderFactNothing => 'Nothing charged';

  @override
  String orderFactDiscount(String promotion, String rule) {
    return '$promotion · $rule';
  }

  @override
  String get orderDirectionsLabel => 'The way to the counter';

  @override
  String orderPlaceLine(String seller, String address) {
    return '$seller · $address';
  }

  @override
  String get orderDirections => 'Directions';

  @override
  String get orderSeeOthers => 'See other offers';

  @override
  String orderCollectedAt(String time) {
    return 'Collected at $time';
  }

  @override
  String orderSavedLine(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return 'Saved against the original price · $_temp0 not wasted';
  }

  @override
  String orderEndedAtCollected(String time, String date) {
    return 'Collected at $time · $date';
  }

  @override
  String get orderEndedBadgeCancelled => 'Order cancelled';

  @override
  String get orderEndedBadgeRefused => 'The shop did not hand over this order';

  @override
  String get orderEndedBadgeExpired => 'Order expired';

  @override
  String get orderTimelineTitle => 'Status';

  @override
  String get orderTimelinePlaced => 'You placed the order';

  @override
  String orderTimelinePlacedBody(
    String date,
    String time,
    int units,
    String total,
  ) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$date, $time · $_temp0 · $total';
  }

  @override
  String get orderTimelineConfirmed => 'The seller confirmed it';

  @override
  String orderTimelineConfirmedBody(String time, int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$time · $_temp0 kept for you';
  }

  @override
  String get orderTimelineCancelled => 'You cancelled the order';

  @override
  String orderTimelineWithReason(String time, String reason) {
    return '$time · $reason';
  }

  @override
  String orderTimelineReturned(int units) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$_temp0 back with the shop';
  }

  @override
  String get orderTimelineReturnedBody => 'Someone else can order them';

  @override
  String get orderTimelineReady => 'The food was ready';

  @override
  String orderTimelineReadyBody(String time) {
    return '$time · the seller says come and collect';
  }

  @override
  String orderTimelineToldBody(String date, String time) {
    return '$date, $time · the shop told you';
  }

  @override
  String get orderTimelineCollected => 'You collected the food';

  @override
  String orderTimelineCollectedBody(String time, String total) {
    return '$time · paid $total';
  }

  @override
  String orderTimelineCollectedRated(String time, String total, int stars) {
    String _temp0 = intl.Intl.pluralLogic(
      stars,
      locale: localeName,
      other: '$stars stars',
      one: '1 star',
    );
    return '$time · paid $total · you rated $_temp0';
  }

  @override
  String get orderTimelineRefused => 'The shop turned the order down';

  @override
  String orderTimelineRefusedBody(String time, String reason) {
    return '$time · reason: $reason';
  }

  @override
  String get orderTimelineExpired => 'Collection time over';

  @override
  String orderTimelineExpiredBody(String until) {
    return '$until · recorded as not collected';
  }

  @override
  String get orderTimelineSummaryCancelled =>
      'You had not paid, so there is nothing to refund.';

  @override
  String orderTimelineSummaryRefused(String reason) {
    return 'The shop could not hand over the order: $reason. You do not pay.';
  }

  @override
  String orderTimelineSummaryExpired(String until) {
    return 'Nobody came to collect before $until. Next time, if you cannot make it, cancel the order so the food reaches someone else.';
  }

  @override
  String get orderRefuseReasonNotSuitable => 'the food was no longer fit';

  @override
  String get orderRefuseReasonWrongItems => 'the food did not match the order';

  @override
  String get orderRefuseReasonNoAnswer =>
      'the shop could not reach you by phone';

  @override
  String get orderRefuseReasonNoShow => 'you did not come to collect';

  @override
  String get orderRefuseReasonLate => 'the collection time had passed';

  @override
  String get orderRefuseReasonSoldOut => 'the food ran out';

  @override
  String get orderRefuseReasonOther => 'another reason';

  @override
  String get orderRefuseReasonWithdrawn => 'the store withdrew this post';

  @override
  String get orderCancelOpen => 'Cancel order';

  @override
  String orderCancelTitle(String number) {
    return 'Cancel order #$number?';
  }

  @override
  String orderCancelBody(int units, String seller) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions go',
      one: '1 portion goes',
    );
    return '$_temp0 back to $seller for someone else.';
  }

  @override
  String get orderCancelReason => 'Reason (optional)';

  @override
  String get orderCancelReasonLate => 'Cannot make it';

  @override
  String get orderCancelReasonMistake => 'Ordered by mistake';

  @override
  String get orderCancelReasonOther => 'Another reason';

  @override
  String get orderCancelKeep => 'Keep order';

  @override
  String get orderCancelConfirm => 'Cancel order';

  @override
  String get orderCancelFailed =>
      'The order could not be cancelled. Try again in a moment.';

  @override
  String get reviewTitle => 'How was it today?';

  @override
  String get reviewHint => 'Your rating helps the shop and the next buyers.';

  @override
  String get reviewStarsLegend => 'Stars';

  @override
  String reviewStar(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count stars',
      one: '1 star',
    );
    return '$_temp0';
  }

  @override
  String get reviewWord1 => 'Bad';

  @override
  String get reviewWord2 => 'Not great';

  @override
  String get reviewWord3 => 'Okay';

  @override
  String get reviewWord4 => 'Good';

  @override
  String get reviewWord5 => 'Excellent';

  @override
  String get reviewTagsTitle => 'What did you like?';

  @override
  String get reviewTagFastPickup => 'Quick pickup';

  @override
  String get reviewTagGoodQuality => 'Good quality';

  @override
  String get reviewTagGoodVariety => 'Good variety';

  @override
  String get reviewTagFairPortions => 'Fair portions';

  @override
  String get reviewComment => 'A few words for the shop (optional)';

  @override
  String get reviewSubmit => 'Send rating';

  @override
  String get reviewFailed =>
      'The rating could not be sent. Try again in a moment.';

  @override
  String get reviewGiven => 'Your rating';

  @override
  String get reviewThanks => 'Thank you, the shop will read it.';

  @override
  String get reviewErrorStars => 'Choose how many stars to give.';

  @override
  String get orderProblemOpen => 'Report a problem with the order';

  @override
  String orderProblemTitle(String number) {
    return 'What went wrong with order #$number?';
  }

  @override
  String get orderProblemBody =>
      'Pick what was not right. We pass it to the store, which answers you.';

  @override
  String get orderProblemKindLegend => 'What was not right';

  @override
  String get orderProblemKindMissingItem => 'A missing item';

  @override
  String get orderProblemKindWrongItem => 'A wrong item';

  @override
  String get orderProblemKindPoorQuality => 'Poor quality';

  @override
  String get orderProblemKindStoreClosed => 'The store was closed';

  @override
  String get orderProblemNote => 'Anything to add (optional)';

  @override
  String get orderProblemNotePlaceholder =>
      'For example: one bread roll was missing';

  @override
  String get orderProblemSend => 'Send to the store';

  @override
  String get orderProblemLater => 'Later';

  @override
  String get orderProblemFailed =>
      'It could not be sent. Try again in a few minutes.';

  @override
  String get orderProblemErrorKind => 'Pick what went wrong with the order.';

  @override
  String get orderProblemReportedTitle => 'The problem you reported';

  @override
  String orderProblemNoteAt(String time, String note) {
    return '$time · $note';
  }

  @override
  String orderProblemSent(String seller) {
    return 'Sent to $seller';
  }

  @override
  String get orderProblemWaiting => 'The store will answer you here';

  @override
  String orderProblemAnswered(String seller, String time) {
    return '$seller answered · $time';
  }

  @override
  String chatUnread(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count unread messages',
      one: '1 unread message',
    );
    return '$_temp0';
  }

  @override
  String get chatMessageStore => 'Message the store';

  @override
  String get chatViewMessages => 'View messages';

  @override
  String get chatStoreWrote => 'The store just wrote';

  @override
  String chatQuote(String text) {
    return '“$text”';
  }

  @override
  String get chatSeeMessage => 'See message';

  @override
  String chatCardMeta(int units, String from, String until) {
    String _temp0 = intl.Intl.pluralLogic(
      units,
      locale: localeName,
      other: '$units portions',
      one: '1 portion',
    );
    return '$_temp0 · $from–$until today';
  }

  @override
  String chatConfirmedToday(String number) {
    return 'Today · Order #$number confirmed';
  }

  @override
  String chatConfirmedOn(String date, String number) {
    return '$date · Order #$number confirmed';
  }

  @override
  String get chatLog => 'Messages of the order';

  @override
  String get chatMine => 'You';

  @override
  String chatSeen(String time) {
    return '$time · Seen';
  }

  @override
  String get chatNote =>
      'Messages do not change the order\'s price, quantity or collection time.';

  @override
  String get chatPlaceholderToStore => 'Message the store…';

  @override
  String get chatSend => 'Send message';

  @override
  String get chatRetry => 'Send again';

  @override
  String get chatFailed => 'Not sent';

  @override
  String get chatQuickReplies => 'Quick replies';

  @override
  String get chatReplyComing => 'I\'m on my way';

  @override
  String get chatReplyLate => 'Let me collect 10 minutes late';

  @override
  String get chatReplyStillHave => 'Does the store still have the dishes?';

  @override
  String get chatLocked =>
      'This order has ended, so you can only read the messages.';

  @override
  String get homePlaceAll => 'All shops';

  @override
  String get homePlaceNearby => 'My location';

  @override
  String get homeHeadingAll => 'Tonight: All shops';

  @override
  String homeHeadingAround(String place) {
    return 'Tonight around $place';
  }

  @override
  String get homeAreaPlace => 'Sellers around here';

  @override
  String get homeAreaNearby => 'Sellers near you';

  @override
  String get homeFilters => 'Filter dishes';

  @override
  String get areaOpen => 'Choose where to look';

  @override
  String get areaTitle => 'Where should we look?';

  @override
  String get areaClose => 'Close';

  @override
  String get areaField => 'Find a place to look around';

  @override
  String get areaFieldPlaceholder => 'Type an address or an area…';

  @override
  String get areaClear => 'Clear what you typed';

  @override
  String areaSuggestions(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count suggested places',
      one: '1 suggested place',
      zero: 'No places',
    );
    return '$_temp0';
  }

  @override
  String get areaNoPlace =>
      'We could not find this place. Try another ward, street or building, or use your location.';

  @override
  String get areaAreas => 'Areas';

  @override
  String get areaAll => 'All shops';

  @override
  String get areaAllHint => 'Default · ending soonest first';

  @override
  String get areaMall => 'Tasco Mall Long Biên';

  @override
  String get areaMallHint => 'Suggested · the shops in the mall';

  @override
  String get areaNearby => 'Near me';

  @override
  String get areaNearbyHint => 'Allow location to see sellers near you';

  @override
  String get areaApply => 'Show dishes';

  @override
  String get areaLocating => 'Finding where you are…';

  @override
  String get areaDenied =>
      'The app is not allowed to use your location. Allow it in your phone\'s Settings, or see dishes at all shops.';

  @override
  String get areaFailed =>
      'We could not find where you are. Try again later, or see dishes at all shops.';

  @override
  String get searchTitle => 'Search';

  @override
  String get searchLabel => 'Search dishes or sellers';

  @override
  String get searchPlaceholder => 'Search dishes and sellers';

  @override
  String get searchBack => 'Back to home';

  @override
  String get searchClear => 'Clear the words';

  @override
  String get searchRecent => 'Recent searches';

  @override
  String get searchClearRecent => 'Clear';

  @override
  String searchForget(String words) {
    return 'Remove “$words” from recent searches';
  }

  @override
  String get searchFilters => 'Filters';

  @override
  String get searchDistance => 'Distance';

  @override
  String get searchAnyDistance => 'Any distance';

  @override
  String searchWithin(String distance) {
    return 'Within $distance';
  }

  @override
  String get searchPrice => 'Price';

  @override
  String get searchWhen => 'Collection time';

  @override
  String get searchNow => 'Collect now';

  @override
  String get searchKind => 'Kind';

  @override
  String get searchAnyKind => 'Any kind';

  @override
  String searchSort(String sort) {
    String _temp0 = intl.Intl.selectLogic(sort, {
      'relevance': 'Best match',
      'distance': 'Nearest',
      'ending_soon': 'Closing soon',
      'price': 'Lowest price',
      'discount': 'Biggest discount',
      'other': 'Best match',
    });
    return '$_temp0';
  }

  @override
  String get searchSortBy => 'Sort';

  @override
  String searchDishesFor(int count, String q) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count dishes',
      one: '1 dish',
    );
    return '$_temp0 for “$q”';
  }

  @override
  String searchDishesHere(int count, String place) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count dishes',
      one: '1 dish',
    );
    String _temp1 = intl.Intl.selectLogic(place, {
      'near': ' nearby',
      'other': '',
    });
    return '$_temp0 on sale$_temp1';
  }

  @override
  String get searchNothing => 'No dish matches.';

  @override
  String get searchEverything => 'See every dish';

  @override
  String get searchResetFilters => 'Reset filters';

  @override
  String get searchFrom => 'From';

  @override
  String get searchTo => 'To';

  @override
  String searchRange(String from, String to) {
    return '$from–$to';
  }

  @override
  String searchRangeFrom(String from) {
    return 'From $from';
  }

  @override
  String searchRangeTo(String to) {
    return 'Up to $to';
  }

  @override
  String get searchPriceOrder => 'The lowest price must be below the highest.';

  @override
  String get searchTimeOrder => 'The start must be before the end.';

  @override
  String get searchApply => 'Apply';

  @override
  String get searchClearFilter => 'Clear';

  @override
  String get searchQuick => 'Quick picks';

  @override
  String get searchAnyTime => 'Any time';

  @override
  String get searchLowest => 'Lowest';

  @override
  String get searchHighest => 'Highest';

  @override
  String get searchPopular => 'Popular dishes';

  @override
  String searchOnSale(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count dishes',
      one: '1 dish',
    );
    return '$_temp0 on sale';
  }

  @override
  String get searchViewGrid => 'Show as a grid';

  @override
  String get searchViewList => 'Show as a list';

  @override
  String get searchViewSeller => 'View store';

  @override
  String searchViewSellerNamed(String seller) {
    return 'View $seller';
  }

  @override
  String get favouritesTitle => 'Favourites';

  @override
  String get favouritesIntro => 'Shops you follow';

  @override
  String favouritesFollow(String name) {
    return 'Favourite $name';
  }

  @override
  String get favouritesAdded => 'Added to Favourites';

  @override
  String get favouritesRemoved => 'Removed from Favourites';

  @override
  String get favouritesFailed => 'Not saved, try again later.';

  @override
  String get favouritesNoneTonight => 'Nothing on sale tonight';

  @override
  String get favouritesEmptyTitle => 'No favourite shops yet';

  @override
  String get favouritesEmptyBody => 'Tap ♡ on a shop\'s page to follow it.';

  @override
  String get favouritesExplore => 'Explore shops';
}
