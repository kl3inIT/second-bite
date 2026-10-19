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
  String get signInEmailInvalid =>
      'Enter one email address, such as name@gmail.com.';

  @override
  String get signInCodeLimit =>
      'Too many codes were asked for this address. Wait a while, then try again.';

  @override
  String get signInCodeIncorrect =>
      'The code is not right. Check the latest email and enter it again.';

  @override
  String get signInCodeGone =>
      'This code has expired or was already used. Send a new code.';

  @override
  String get signInGoogleUnverified =>
      'Google has not confirmed this address. Sign in with a code sent by email.';

  @override
  String get signInFailed => 'You could not be signed in. Please try again.';

  @override
  String signInFailedWithReference(String reference) {
    return 'You could not be signed in. Please try again. Reference: $reference';
  }

  @override
  String get signInNotArrived => 'No email yet? Check your spam folder.';
}
