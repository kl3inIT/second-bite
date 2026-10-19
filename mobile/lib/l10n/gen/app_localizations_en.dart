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
}
