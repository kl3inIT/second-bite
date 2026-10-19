import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'gen/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('vi'),
    Locale('en'),
  ];

  /// The app's name, shown by the system and read for the wordmark
  ///
  /// In vi, this message translates to:
  /// **'Second Bite'**
  String get appTitle;

  /// The home's heading as a screen reader hears it; on screen only the place shows
  ///
  /// In vi, this message translates to:
  /// **'Tối nay ở Tasco Mall'**
  String get homeTitle;

  /// The place on the home's header
  ///
  /// In vi, this message translates to:
  /// **'Tasco Mall'**
  String get homePlace;

  /// The district under the place on the header
  ///
  /// In vi, this message translates to:
  /// **'Long Biên, Hà Nội'**
  String get homeArea;

  /// What the search field is for, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Tìm món hoặc quán'**
  String get homeSearchLabel;

  /// Hint in the empty search field
  ///
  /// In vi, this message translates to:
  /// **'Tìm bánh, gỏi cuốn, rau củ…'**
  String get homeSearchPlaceholder;

  /// Name of the row of kinds of food
  ///
  /// In vi, this message translates to:
  /// **'Loại món'**
  String get homeKindsLabel;

  /// The first item of the kinds row: only what can be collected now
  ///
  /// In vi, this message translates to:
  /// **'Lấy ngay'**
  String get homeCollectNow;

  /// Title of the deal card on the header
  ///
  /// In vi, this message translates to:
  /// **'Túi ngon tối nay ở Tasco Mall'**
  String get homeDealsTitle;

  /// Above the biggest discount on the deal card
  ///
  /// In vi, this message translates to:
  /// **'Giảm đến'**
  String get homeUpTo;

  /// The biggest discount tonight, written large
  ///
  /// In vi, this message translates to:
  /// **'{percent}%'**
  String homeUpToPercent(int percent);

  /// When collection opens, on a ticket of the deal card
  ///
  /// In vi, this message translates to:
  /// **'Lấy {from}'**
  String homeTicketWindow(String from);

  /// The strip under the deal card: bags still open and when the last window closes
  ///
  /// In vi, this message translates to:
  /// **'{bags} túi đang mở · túi cuối lúc {last}'**
  String homeOpenBags(int bags, String last);

  /// Title of the row of offers whose windows close first
  ///
  /// In vi, this message translates to:
  /// **'Sắp hết giờ lấy'**
  String get homeClosingSoon;

  /// Action beside a section title that goes to the whole list
  ///
  /// In vi, this message translates to:
  /// **'Xem tất cả'**
  String get homeSeeAll;

  /// Title of the grid of every offer
  ///
  /// In vi, this message translates to:
  /// **'Quanh bạn ở Tasco Mall'**
  String get homeAllOffers;

  /// Title of the grid when a filter or a search is applied
  ///
  /// In vi, this message translates to:
  /// **'Kết quả'**
  String get homeResults;

  /// Shown when no offer has been posted tonight
  ///
  /// In vi, this message translates to:
  /// **'Tối nay chưa có món nào.'**
  String get homeEmpty;

  /// Shown when nothing matches the filter or the search
  ///
  /// In vi, this message translates to:
  /// **'Không có món nào khớp bộ lọc này.'**
  String get homeEmptyFiltered;

  /// Clears the filter
  ///
  /// In vi, this message translates to:
  /// **'Xem tất cả món'**
  String get homeShowAll;

  /// Read by a screen reader while the offers load
  ///
  /// In vi, this message translates to:
  /// **'Đang tải món…'**
  String get homeLoading;

  /// The sticker on a photograph: units left
  ///
  /// In vi, this message translates to:
  /// **'Còn {units}'**
  String offerStock(int units);

  /// The sticker of an offer with nothing left
  ///
  /// In vi, this message translates to:
  /// **'Đã hết'**
  String get offerSoldOut;

  /// The collection window on a compact card
  ///
  /// In vi, this message translates to:
  /// **'Lấy {from}–{until}'**
  String offerWindow(String from, String until);

  /// The collection window and place on an offer card
  ///
  /// In vi, this message translates to:
  /// **'{from}–{until} · {place}'**
  String offerWindowAt(String from, String until, String place);

  /// The discount as written on the chip
  ///
  /// In vi, this message translates to:
  /// **'-{percent}%'**
  String offerDiscount(int percent);

  /// The discount as a screen reader says it
  ///
  /// In vi, this message translates to:
  /// **'Giảm {percent}%'**
  String offerDiscountLabel(int percent);

  /// The struck-through price as a screen reader says it
  ///
  /// In vi, this message translates to:
  /// **'Giá gốc {price}'**
  String offerOriginalPrice(String price);

  /// A kind of food, by the API's name for it
  ///
  /// In vi, this message translates to:
  /// **'{kind, select, bakery{Bánh} prepared_food{Món chín} ingredients{Nguyên liệu} drinks{Đồ uống} mixed_box{Hộp tổng hợp} other{Khác}}'**
  String offerKind(String kind);

  /// Title of the introduction for a first visit
  ///
  /// In vi, this message translates to:
  /// **'Second Bite là gì?'**
  String get introTitle;

  /// What Second Bite is, in two sentences
  ///
  /// In vi, this message translates to:
  /// **'Món ngon còn lại cuối ngày của các quán ở Tasco Mall, giá thấp hơn. Bạn đặt trước rồi đến quầy lấy trong khung giờ của món.'**
  String get introBody;

  /// Closes the introduction
  ///
  /// In vi, this message translates to:
  /// **'Đóng giới thiệu'**
  String get introDismiss;

  /// The language button on the header, in the language it switches to
  ///
  /// In vi, this message translates to:
  /// **'Switch to English'**
  String get languageSwitch;

  /// Title when the offers could not be loaded
  ///
  /// In vi, this message translates to:
  /// **'Đã có lỗi xảy ra'**
  String get errorTitle;

  /// Shown when the server could not be reached
  ///
  /// In vi, this message translates to:
  /// **'Không kết nối được. Vui lòng kiểm tra mạng rồi thử lại.'**
  String get errorOffline;

  /// Shown when the server failed without words of its own
  ///
  /// In vi, this message translates to:
  /// **'Vui lòng thử lại. Nếu vẫn lỗi, hãy báo cho chúng tôi mã bên dưới.'**
  String get errorBody;

  /// The request's id, for the person to report
  ///
  /// In vi, this message translates to:
  /// **'Mã tham chiếu: {reference}'**
  String errorReference(String reference);

  /// Asks for the offers again
  ///
  /// In vi, this message translates to:
  /// **'Thử lại'**
  String get errorRetry;

  /// The bottom bar, as a screen reader names it
  ///
  /// In vi, this message translates to:
  /// **'Điều hướng chính'**
  String get navLabel;

  /// The home tab
  ///
  /// In vi, this message translates to:
  /// **'Trang chủ'**
  String get navHome;

  /// The orders tab, not open yet
  ///
  /// In vi, this message translates to:
  /// **'Đơn của tôi'**
  String get navOrders;

  /// The saved sellers tab, not open yet
  ///
  /// In vi, this message translates to:
  /// **'Yêu thích'**
  String get navSaved;

  /// The account tab
  ///
  /// In vi, this message translates to:
  /// **'Tài khoản'**
  String get navAccount;

  /// Read after a tab that has no screen yet
  ///
  /// In vi, this message translates to:
  /// **'(sắp có)'**
  String get navSoon;

  /// The account tab's title
  ///
  /// In vi, this message translates to:
  /// **'Tài khoản'**
  String get accountTitle;

  /// The account card of someone signed out
  ///
  /// In vi, this message translates to:
  /// **'Bạn chưa đăng nhập'**
  String get accountGuestTitle;

  /// Under the signed-out title
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập để đặt món và theo dõi đơn.'**
  String get accountGuestBody;

  /// The list of legal pages, as a screen reader names it
  ///
  /// In vi, this message translates to:
  /// **'Thông tin pháp lý'**
  String get legalLabel;

  /// Opens the terms of use on the web
  ///
  /// In vi, this message translates to:
  /// **'Điều khoản sử dụng'**
  String get legalTerms;

  /// Opens the privacy policy on the web
  ///
  /// In vi, this message translates to:
  /// **'Chính sách quyền riêng tư'**
  String get legalPrivacy;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'vi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'vi':
      return AppLocalizationsVi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
