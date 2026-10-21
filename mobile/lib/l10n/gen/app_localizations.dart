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
  /// **'Nhận ngay'**
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
  /// **'Nhận {from}'**
  String homeTicketWindow(String from);

  /// The strip under the deal card: bags still open and when the last window closes
  ///
  /// In vi, this message translates to:
  /// **'{bags} túi đang mở · túi cuối lúc {last}'**
  String homeOpenBags(int bags, String last);

  /// Title of the row of offers whose windows close first
  ///
  /// In vi, this message translates to:
  /// **'Sắp hết giờ nhận'**
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
  /// **'Nhận {from}–{until}'**
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
  /// **'Món ngon còn lại cuối ngày của các quán ở Tasco Mall, giá thấp hơn. Bạn đặt trước rồi đến quầy nhận trong khung giờ của món.'**
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

  /// Opens the terms of use
  ///
  /// In vi, this message translates to:
  /// **'Điều khoản sử dụng'**
  String get legalTerms;

  /// Opens the privacy policy
  ///
  /// In vi, this message translates to:
  /// **'Chính sách quyền riêng tư'**
  String get legalPrivacy;

  /// The notice that the legal pages are drafts, as the web's Legal.draft
  ///
  /// In vi, this message translates to:
  /// **'Bản nháp, đang chờ người sáng lập và luật sư xem xét. Nội dung có thể thay đổi trước khi Second Bite mở cho mọi người; những chỗ ghi “đang cập nhật” sẽ được bổ sung.'**
  String get legalDraft;

  /// When the legal pages last changed
  ///
  /// In vi, this message translates to:
  /// **'Cập nhật lần cuối: {date}'**
  String legalUpdated(DateTime date);

  /// The heading of the list of sections
  ///
  /// In vi, this message translates to:
  /// **'Các mục'**
  String get legalContents;

  /// The opening paragraph, as the web's Terms.intro
  ///
  /// In vi, this message translates to:
  /// **'Điều khoản này là thỏa thuận giữa bạn và Second Bite khi bạn dùng trang web và ứng dụng Second Bite, với tư cách khách hàng hay người bán.'**
  String get legalTermsIntro;

  /// Section 1's heading, as the web's Terms.sections[0].title
  ///
  /// In vi, this message translates to:
  /// **'1. Second Bite là gì'**
  String get legalTermsSection1Title;

  /// Section 1's paragraphs, one blank line apart, as the web's Terms.sections[0].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Second Bite là nền tảng phi lợi nhuận kết nối các quán còn món dư cuối ngày với khách muốn mua với giá thấp hơn. Second Bite không lấy hoa hồng trên doanh thu của quán.\n\nĐơn vị vận hành: đang cập nhật (tên, địa chỉ, mã số và giấy phép nếu có).\n\nMua bán món diễn ra giữa khách và quán. Second Bite cung cấp nơi đăng, tìm và đặt món; Second Bite không bán món và không kiểm tra món.'**
  String get legalTermsSection1Body;

  /// Section 2's heading, as the web's Terms.sections[1].title
  ///
  /// In vi, this message translates to:
  /// **'2. Tài khoản'**
  String get legalTermsSection2Title;

  /// Section 2's paragraphs, one blank line apart, as the web's Terms.sections[1].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Bạn xem và tìm món mà không cần tài khoản. Bạn cần đăng nhập để đặt món, theo dõi quán, hoặc đăng món cho một quán.\n\nHãy giữ an toàn hộp thư và tài khoản Google bạn dùng để đăng nhập, và không đăng nhập thay người khác.'**
  String get legalTermsSection2Body;

  /// Section 3's heading, as the web's Terms.sections[2].title
  ///
  /// In vi, this message translates to:
  /// **'3. Trách nhiệm của người bán'**
  String get legalTermsSection3Title;

  /// Section 3's paragraphs, one blank line apart, as the web's Terms.sections[2].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Chỉ đăng món thật sự còn dư, không phải món vẫn cần cho việc bán hàng bình thường.\n\nMô tả trung thực món, số lượng, giá gốc và giá bán; giá bán phải thấp hơn giá gốc ít nhất mức giảm tối thiểu do Second Bite quy định (hiện là 20%).\n\nChịu trách nhiệm về chất lượng, an toàn thực phẩm và thông tin về chất gây dị ứng của món, và kiểm tra món khi giao cho khách.\n\nẢnh và nội dung bạn đăng phải là của bạn hoặc bạn được phép dùng; bạn cho phép Second Bite hiển thị chúng trên nền tảng.'**
  String get legalTermsSection3Body;

  /// Section 4's heading, as the web's Terms.sections[3].title
  ///
  /// In vi, this message translates to:
  /// **'4. Trách nhiệm của khách'**
  String get legalTermsSection4Title;

  /// Section 4's paragraphs, one blank line apart, as the web's Terms.sections[3].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Đến lấy món trong khung giờ của món; đơn không đến lấy có thể bị ghi nhận và ảnh hưởng tới việc đặt món về sau.\n\nĐọc kỹ mô tả món, đặc biệt là thông tin về chất gây dị ứng, và hỏi quán khi chưa rõ. Món dư có thể khác chút ít so với ảnh.\n\nMỗi người được đặt một số lượng món giới hạn mỗi ngày, để món dư đến được với nhiều người.'**
  String get legalTermsSection4Body;

  /// Section 5's heading, as the web's Terms.sections[4].title
  ///
  /// In vi, this message translates to:
  /// **'5. Giá, thanh toán và hủy đơn'**
  String get legalTermsSection5Title;

  /// Section 5's paragraphs, one blank line apart, as the web's Terms.sections[4].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Giá hiển thị là giá của quán; phí của bên thứ ba, nếu có, được ghi riêng trước khi bạn đặt.\n\nỞ giai đoạn thử nghiệm, bạn thanh toán trực tiếp cho quán khi đến lấy món. Hủy đơn và hoàn tiền: đang cập nhật, sẽ có khi tính năng đặt món mở.'**
  String get legalTermsSection5Body;

  /// Section 6's heading, as the web's Terms.sections[5].title
  ///
  /// In vi, this message translates to:
  /// **'6. Hành vi không được phép'**
  String get legalTermsSection6Title;

  /// Section 6's paragraphs, one blank line apart, as the web's Terms.sections[5].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Đăng nội dung sai sự thật, vi phạm pháp luật hoặc của người khác; đặt món mà không có ý định lấy; can thiệp vào hệ thống hoặc dùng tài khoản của người khác.\n\nSecond Bite có thể ẩn món, tạm khóa quán hoặc tài khoản vi phạm điều khoản này.'**
  String get legalTermsSection6Body;

  /// Section 7's heading, as the web's Terms.sections[6].title
  ///
  /// In vi, this message translates to:
  /// **'7. Giới hạn trách nhiệm'**
  String get legalTermsSection7Title;

  /// Section 7's paragraphs, one blank line apart, as the web's Terms.sections[6].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Second Bite cố gắng giữ dịch vụ hoạt động ổn định nhưng không bảo đảm dịch vụ luôn sẵn sàng. Trong phạm vi pháp luật cho phép, Second Bite không chịu trách nhiệm về chất lượng món do quán bán; khiếu nại về món được gửi tới quán, và Second Bite hỗ trợ hai bên giải quyết.'**
  String get legalTermsSection7Body;

  /// Section 8's heading, as the web's Terms.sections[7].title
  ///
  /// In vi, this message translates to:
  /// **'8. Thay đổi điều khoản và luật áp dụng'**
  String get legalTermsSection8Title;

  /// Section 8's paragraphs, one blank line apart, as the web's Terms.sections[7].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Khi điều khoản thay đổi, chúng tôi cập nhật ngày ở đầu trang và báo trước nếu thay đổi ảnh hưởng tới quyền của bạn.\n\nĐiều khoản này theo pháp luật Việt Nam. Tranh chấp được giải quyết bằng thương lượng trước, sau đó theo quy định của pháp luật.\n\nLiên hệ: đang cập nhật.'**
  String get legalTermsSection8Body;

  /// The opening paragraph, as the web's Privacy.intro
  ///
  /// In vi, this message translates to:
  /// **'Second Bite là nền tảng phi lợi nhuận giúp các quán bán món còn dư cuối ngày với giá thấp hơn. Trang này cho biết chúng tôi thu dữ liệu cá nhân nào, để làm gì, lưu bao lâu, ai được xem, và bạn có những quyền gì, theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 52/2013/NĐ-CP.'**
  String get legalPrivacyIntro;

  /// Section 1's heading, as the web's Privacy.sections[0].title
  ///
  /// In vi, this message translates to:
  /// **'1. Ai chịu trách nhiệm về dữ liệu của bạn'**
  String get legalPrivacySection1Title;

  /// Section 1's paragraphs, one blank line apart, as the web's Privacy.sections[0].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Bên kiểm soát dữ liệu cá nhân: đang cập nhật (tên tổ chức hoặc cá nhân, địa chỉ).\n\nLiên hệ về quyền riêng tư: đang cập nhật.'**
  String get legalPrivacySection1Body;

  /// Section 2's heading, as the web's Privacy.sections[1].title
  ///
  /// In vi, this message translates to:
  /// **'2. Dữ liệu chúng tôi thu và để làm gì'**
  String get legalPrivacySection2Title;

  /// Section 2's paragraphs, one blank line apart, as the web's Privacy.sections[1].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Xem món và tìm kiếm không cần tài khoản. Khi bạn tìm món quanh một vị trí, vị trí đó chỉ được dùng để tính khoảng cách trong lần tìm ấy và không được lưu.\n\nTài khoản: địa chỉ email của bạn, để gửi mã đăng nhập và nhận ra bạn ở lần sau; tên hiển thị, để quán gọi bạn khi giao món.\n\nĐăng nhập bằng Google (sắp có): mã định danh Google của bạn, địa chỉ email, tên và ảnh đại diện mà Google chia sẻ khi bạn đồng ý, để đăng nhập và hiển thị tên của bạn.\n\nPhiên đăng nhập: một mã ngẫu nhiên giữ bạn đăng nhập; chúng tôi chỉ lưu bản băm của nó cùng thời điểm dùng gần nhất.\n\nNgười bán: tên quán, địa chỉ, vị trí trên bản đồ, số điện thoại của quán và email của chủ quán, nhân viên, để quán đăng món và khách tìm đến lấy.\n\nẢnh: ảnh món và ảnh quán do người bán tải lên. Ảnh được ghi lại ở hai kích thước và bỏ toàn bộ thông tin đi kèm như vị trí chụp hay loại máy.\n\nĐơn hàng (sắp có): món, số lượng, giờ lấy, trạng thái đơn, để quán chuẩn bị món và giới hạn số món mỗi người được đặt trong ngày.\n\nEmail đã gửi: người nhận, loại email và mã của nhà cung cấp, để biết email có tới được không.\n\nNhật ký kỹ thuật: thời điểm, đường dẫn và kết quả của từng yêu cầu, để tìm và sửa lỗi; nhật ký không ghi email, mã đăng nhập hay mật khẩu.'**
  String get legalPrivacySection2Body;

  /// Section 3's heading, as the web's Privacy.sections[2].title
  ///
  /// In vi, this message translates to:
  /// **'3. Lưu bao lâu'**
  String get legalPrivacySection3Title;

  /// Section 3's paragraphs, one blank line apart, as the web's Privacy.sections[2].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Mã đăng nhập: xóa khi dùng xong, khi bạn xin mã mới, hoặc muộn nhất một ngày sau khi gửi.\n\nPhiên đăng nhập: hết hạn sau 30 ngày không dùng; xóa khi bạn đăng xuất.\n\nẢnh tải lên nhưng không dùng cho món hay quán nào: xóa sau một ngày.\n\nTài khoản, quán, món đã đăng và đơn hàng: giữ cho tới khi bạn xóa tài khoản hoặc yêu cầu xóa, trừ phần pháp luật buộc phải giữ lâu hơn.\n\nKhi bạn xóa tài khoản: tài khoản, phiên đăng nhập, liên kết Google, mã đăng nhập và bản ghi các email gửi cho bạn bị xóa ngay; tư cách thành viên ở các quán và ảnh chưa dùng bị xóa trong vài phút sau đó. Món đã đăng, ảnh món và ảnh quán thuộc về quán nên được giữ, không còn gắn với bạn; quán bạn là chủ sẽ bị đóng.'**
  String get legalPrivacySection3Body;

  /// Section 4's heading, as the web's Privacy.sections[3].title
  ///
  /// In vi, this message translates to:
  /// **'4. Ai được xem dữ liệu của bạn'**
  String get legalPrivacySection4Title;

  /// Section 4's paragraphs, one blank line apart, as the web's Privacy.sections[3].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Người bán thấy tên hiển thị và đơn hàng của bạn với quán của họ; không thấy email của bạn. Khách thấy thông tin công khai của quán và món.\n\nQuản trị viên của Second Bite xem dữ liệu khi cần để vận hành và hỗ trợ.\n\nCác bên xử lý dữ liệu thay chúng tôi: nhà cung cấp máy chủ (Amazon Web Services; nơi đặt máy chủ: đang cập nhật), nhà cung cấp dịch vụ email (Brevo), và Google khi bạn chọn đăng nhập bằng Google. Nếu dữ liệu được lưu ở nước ngoài, chúng tôi sẽ nêu rõ tại đây.\n\nChúng tôi không bán dữ liệu của bạn và không dùng nó để quảng cáo.'**
  String get legalPrivacySection4Body;

  /// Section 5's heading, as the web's Privacy.sections[4].title
  ///
  /// In vi, this message translates to:
  /// **'5. Quyền của bạn'**
  String get legalPrivacySection5Title;

  /// Section 5's paragraphs, one blank line apart, as the web's Privacy.sections[4].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Bạn có quyền được biết, xem, sửa và yêu cầu xóa dữ liệu của mình; rút lại sự đồng ý; yêu cầu hạn chế xử lý; và khiếu nại, theo Luật Bảo vệ dữ liệu cá nhân 2025.\n\nBạn tự xóa được tài khoản trong ứng dụng (Tài khoản → Cài đặt tài khoản → Xóa tài khoản) hoặc trên trang web tại /delete-account, sau khi nhập mã chúng tôi gửi đến email của tài khoản.\n\nBạn tự sửa được tên hiển thị trong tài khoản. Với các yêu cầu khác, hãy gửi cho chúng tôi qua địa chỉ liên hệ ở mục 1; chúng tôi trả lời trong thời hạn pháp luật quy định, và nếu không thể xóa vì lý do chính đáng, chúng tôi sẽ cho bạn biết lý do.'**
  String get legalPrivacySection5Body;

  /// Section 6's heading, as the web's Privacy.sections[5].title
  ///
  /// In vi, this message translates to:
  /// **'6. Cookie và lưu trữ trên trình duyệt'**
  String get legalPrivacySection6Title;

  /// Section 6's paragraphs, one blank line apart, as the web's Privacy.sections[5].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Cookie phiên đăng nhập (sắp có), để giữ bạn đăng nhập.\n\nCookie ngôn ngữ, nhớ bạn chọn tiếng Việt hay tiếng Anh trong một năm.\n\nMột dấu trong bộ nhớ trình duyệt, nhớ bạn đã đóng phần giới thiệu.\n\nChúng tôi không dùng cookie quảng cáo hay công cụ theo dõi của bên thứ ba.'**
  String get legalPrivacySection6Body;

  /// Section 7's heading, as the web's Privacy.sections[6].title
  ///
  /// In vi, this message translates to:
  /// **'7. Bảo vệ dữ liệu'**
  String get legalPrivacySection7Title;

  /// Section 7's paragraphs, one blank line apart, as the web's Privacy.sections[6].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Kết nối được mã hóa; mã đăng nhập và phiên đăng nhập chỉ được lưu dưới dạng băm; quyền truy cập được kiểm tra ở máy chủ cho từng yêu cầu. Nếu xảy ra sự cố lộ dữ liệu, chúng tôi sẽ thông báo theo quy định của pháp luật.'**
  String get legalPrivacySection7Body;

  /// Section 8's heading, as the web's Privacy.sections[7].title
  ///
  /// In vi, this message translates to:
  /// **'8. Trẻ em'**
  String get legalPrivacySection8Title;

  /// Section 8's paragraphs, one blank line apart, as the web's Privacy.sections[7].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Second Bite dành cho người từ 16 tuổi. Nếu bạn dưới 16 tuổi, hãy dùng cùng cha mẹ hoặc người giám hộ.'**
  String get legalPrivacySection8Body;

  /// Section 9's heading, as the web's Privacy.sections[8].title
  ///
  /// In vi, this message translates to:
  /// **'9. Thay đổi chính sách'**
  String get legalPrivacySection9Title;

  /// Section 9's paragraphs, one blank line apart, as the web's Privacy.sections[8].paragraphs
  ///
  /// In vi, this message translates to:
  /// **'Khi chính sách thay đổi, chúng tôi cập nhật ngày ở đầu trang và báo cho bạn trước khi thay đổi có hiệu lực nếu nó ảnh hưởng tới quyền của bạn.'**
  String get legalPrivacySection9Body;

  /// An address the app does not know, as the web's NotFound.title
  ///
  /// In vi, this message translates to:
  /// **'Không tìm thấy trang này'**
  String get notFoundTitle;

  /// The button back to the home from the not-found screen
  ///
  /// In vi, this message translates to:
  /// **'Về trang chủ'**
  String get notFoundBack;

  /// The top bar's back button, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Quay lại'**
  String get topBarBack;

  /// The header capsule and the account tab's button that open sign-in
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập'**
  String get accountSignIn;

  /// The header's account button, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Tài khoản {email}'**
  String accountMenu(String email);

  /// At the top of the header's account menu
  ///
  /// In vi, this message translates to:
  /// **'Đã đăng nhập: {email}'**
  String accountSignedInAs(String email);

  /// Ends the session
  ///
  /// In vi, this message translates to:
  /// **'Đăng xuất'**
  String get accountSignOut;

  /// Under the address on the account tab
  ///
  /// In vi, this message translates to:
  /// **'Đã đăng nhập'**
  String get accountSignedIn;

  /// The sign-in screen's top bar
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập'**
  String get signInTitle;

  /// The sign-in screen's heading
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập để đặt món'**
  String get signInHeading;

  /// The divider between Google and the email field
  ///
  /// In vi, this message translates to:
  /// **'hoặc dùng email'**
  String get signInOr;

  /// Google's button, in Google's own wording
  ///
  /// In vi, this message translates to:
  /// **'Tiếp tục với Google'**
  String get signInGoogle;

  /// The email field's label
  ///
  /// In vi, this message translates to:
  /// **'Email'**
  String get signInEmailLabel;

  /// Hint in the empty email field
  ///
  /// In vi, this message translates to:
  /// **'ten@gmail.com'**
  String get signInEmailPlaceholder;

  /// Sends a code to the address
  ///
  /// In vi, this message translates to:
  /// **'Gửi mã'**
  String get signInSendCode;

  /// Sends a code to the address Google gave
  ///
  /// In vi, this message translates to:
  /// **'Gửi mã đến email này'**
  String get signInSendCodeHere;

  /// The send button while the code is sent
  ///
  /// In vi, this message translates to:
  /// **'Đang gửi mã…'**
  String get signInSending;

  /// Under the form; terms and privacy are links named by legalTerms and legalPrivacy
  ///
  /// In vi, this message translates to:
  /// **'Khi tiếp tục, bạn đồng ý với {terms} và {privacy}.'**
  String signInLegal(String terms, String privacy);

  /// The code step's heading
  ///
  /// In vi, this message translates to:
  /// **'Kiểm tra email của bạn'**
  String get signInCodeHeading;

  /// Where the code was sent; the address is bold
  ///
  /// In vi, this message translates to:
  /// **'Mã đăng nhập 6 số đã gửi đến {email}.'**
  String signInCodeSent(String email);

  /// Goes back to the email step
  ///
  /// In vi, this message translates to:
  /// **'Đổi email'**
  String get signInChangeEmail;

  /// The code field, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Mã đăng nhập 6 số'**
  String get signInCodeLabel;

  /// Confirms the code
  ///
  /// In vi, this message translates to:
  /// **'Xác nhận'**
  String get signInConfirm;

  /// The confirm button while the code is checked
  ///
  /// In vi, this message translates to:
  /// **'Đang xác nhận…'**
  String get signInConfirming;

  /// The wait before a new code can be sent
  ///
  /// In vi, this message translates to:
  /// **'Gửi lại mã sau {time}'**
  String signInResendIn(String time);

  /// Sends a new code
  ///
  /// In vi, this message translates to:
  /// **'Gửi lại mã'**
  String get signInResend;

  /// When Google cannot sign in to an existing account
  ///
  /// In vi, this message translates to:
  /// **'Email này đã có tài khoản'**
  String get signInGoogleNeedsCodeTitle;

  /// Asks for the emailed code instead of Google
  ///
  /// In vi, this message translates to:
  /// **'{email} đã có tài khoản Second Bite. Nhận mã qua email này để đăng nhập.'**
  String signInGoogleNeedsCodeBody(String email);

  /// As signInGoogleNeedsCodeBody when the address is not known
  ///
  /// In vi, this message translates to:
  /// **'Email của tài khoản Google này đã có tài khoản Second Bite. Nhận mã qua email để đăng nhập.'**
  String get signInGoogleNeedsCodeBodyNoAddress;

  /// Any other failure
  ///
  /// In vi, this message translates to:
  /// **'Chưa đăng nhập được. Vui lòng thử lại.'**
  String get signInFailed;

  /// Under the code field
  ///
  /// In vi, this message translates to:
  /// **'Chưa thấy email? Xem trong thư rác (Spam).'**
  String get signInNotArrived;

  /// The deletion screen's title and the account tab's entry
  ///
  /// In vi, this message translates to:
  /// **'Xoá tài khoản'**
  String get deleteAccountTitle;

  /// What deleting means, first on the screen
  ///
  /// In vi, this message translates to:
  /// **'Bạn có thể xoá tài khoản Second Bite bất cứ lúc nào, trong ứng dụng hoặc tại trang này. Việc xoá là vĩnh viễn và không thể hoàn tác.'**
  String get deleteAccountIntro;

  /// The heading of what goes at once
  ///
  /// In vi, this message translates to:
  /// **'Bị xoá ngay khi bạn xác nhận'**
  String get deleteAccountDeletedTitle;

  /// Something deleted at once
  ///
  /// In vi, this message translates to:
  /// **'Tài khoản của bạn: địa chỉ email và tên hiển thị.'**
  String get deleteAccountDeleted1;

  /// Something deleted at once
  ///
  /// In vi, this message translates to:
  /// **'Mọi phiên đăng nhập trên mọi thiết bị, và liên kết với tài khoản Google.'**
  String get deleteAccountDeleted2;

  /// Something deleted at once
  ///
  /// In vi, this message translates to:
  /// **'Mã đăng nhập và bản ghi các email chúng tôi đã gửi cho bạn.'**
  String get deleteAccountDeleted3;

  /// The heading of what goes within minutes
  ///
  /// In vi, this message translates to:
  /// **'Bị xoá trong vài phút sau đó'**
  String get deleteAccountLaterTitle;

  /// Something deleted within minutes
  ///
  /// In vi, this message translates to:
  /// **'Tư cách chủ quán hoặc nhân viên của bạn ở các quán.'**
  String get deleteAccountLater1;

  /// Something deleted within minutes
  ///
  /// In vi, this message translates to:
  /// **'Ảnh bạn đã tải lên nhưng chưa dùng cho món hay quán nào.'**
  String get deleteAccountLater2;

  /// The heading of what is kept
  ///
  /// In vi, this message translates to:
  /// **'Được giữ lại, không còn gắn với bạn'**
  String get deleteAccountKeptTitle;

  /// Something kept, no longer linked to the person
  ///
  /// In vi, this message translates to:
  /// **'Món đã đăng, ảnh món và ảnh quán: chúng thuộc về quán.'**
  String get deleteAccountKept1;

  /// Something kept, no longer linked to the person
  ///
  /// In vi, this message translates to:
  /// **'Đơn hàng và thanh toán mà pháp luật buộc phải giữ, khi tính năng đặt món mở; thời hạn giữ đang cập nhật.'**
  String get deleteAccountKept2;

  /// The warning to the owner of a seller
  ///
  /// In vi, this message translates to:
  /// **'Bạn đang là chủ quán'**
  String get deleteAccountOwnerTitle;

  /// What happens to the sellers the person owns
  ///
  /// In vi, this message translates to:
  /// **'Xoá tài khoản sẽ đóng {sellers}: quán ngừng hiển thị với khách và nhân viên không quản lý được nữa, cho tới khi Second Bite xử lý.'**
  String deleteAccountOwnerBody(String sellers);

  /// Shown to someone signed out
  ///
  /// In vi, this message translates to:
  /// **'Đăng nhập để xoá tài khoản'**
  String get deleteAccountSignedOutTitle;

  /// Why signing in comes first
  ///
  /// In vi, this message translates to:
  /// **'Để chắc người xoá là chủ tài khoản, bạn đăng nhập rồi nhập mã chúng tôi gửi đến email của tài khoản.'**
  String get deleteAccountSignedOutBody;

  /// The button that emails the deletion code
  ///
  /// In vi, this message translates to:
  /// **'Gửi mã xác nhận'**
  String get deleteAccountSendCode;

  /// The button while the code is sent
  ///
  /// In vi, this message translates to:
  /// **'Đang gửi mã…'**
  String get deleteAccountSending;

  /// Where the code will go
  ///
  /// In vi, this message translates to:
  /// **'Chúng tôi sẽ gửi mã 6 số đến {email} để xác nhận bạn muốn xoá tài khoản.'**
  String deleteAccountConfirmBody(String email);

  /// Above the button that sends the code: the deletion cannot be undone
  ///
  /// In vi, this message translates to:
  /// **'Khi bạn nhập đúng mã, tài khoản bị xoá ngay và không thể hoàn tác.'**
  String get deleteAccountFinal;

  /// The sellers the person owns could not be read; the code waits until they are
  ///
  /// In vi, this message translates to:
  /// **'Chưa đọc được các quán của bạn, nên chưa biết quán nào sẽ đóng cùng tài khoản. Thử lại trước khi gửi mã.'**
  String get deleteAccountOwnedFailed;

  /// Reads the person's sellers again
  ///
  /// In vi, this message translates to:
  /// **'Thử lại'**
  String get deleteAccountRetry;

  /// The heading of the code step
  ///
  /// In vi, this message translates to:
  /// **'Nhập mã xác nhận'**
  String get deleteAccountCodeHeading;

  /// Where the code went
  ///
  /// In vi, this message translates to:
  /// **'Mã 6 số đã gửi đến {email}. Mã chỉ dùng để xoá tài khoản.'**
  String deleteAccountCodeSent(String email);

  /// The code field, as a screen reader names it
  ///
  /// In vi, this message translates to:
  /// **'Mã xác nhận 6 số'**
  String get deleteAccountCodeLabel;

  /// The button that deletes the account
  ///
  /// In vi, this message translates to:
  /// **'Xoá vĩnh viễn tài khoản'**
  String get deleteAccountConfirm;

  /// The button while the account is deleted
  ///
  /// In vi, this message translates to:
  /// **'Đang xoá…'**
  String get deleteAccountDeleting;

  /// The way back without deleting
  ///
  /// In vi, this message translates to:
  /// **'Giữ tài khoản'**
  String get deleteAccountCancel;

  /// Any other failure
  ///
  /// In vi, this message translates to:
  /// **'Chưa xoá được tài khoản. Vui lòng thử lại.'**
  String get deleteAccountFailed;

  /// Shown once the account is deleted
  ///
  /// In vi, this message translates to:
  /// **'Đã xoá tài khoản'**
  String get deleteAccountDoneTitle;

  /// What the deletion did, and that the address can sign in again
  ///
  /// In vi, this message translates to:
  /// **'Tài khoản và dữ liệu cá nhân của bạn đã được xoá. Bạn vẫn có thể đăng nhập lại bằng email này bất cứ lúc nào, như một tài khoản mới.'**
  String get deleteAccountDoneBody;

  /// The button home after the deletion
  ///
  /// In vi, this message translates to:
  /// **'Về trang chủ'**
  String get deleteAccountHome;

  /// The account tab's row and the title of account settings
  ///
  /// In vi, this message translates to:
  /// **'Cài đặt tài khoản'**
  String get accountSettingsTitle;

  /// The label of the account's details, for screen readers
  ///
  /// In vi, this message translates to:
  /// **'Thông tin tài khoản'**
  String get accountSettingsDetails;

  /// The row of the account's address
  ///
  /// In vi, this message translates to:
  /// **'Email'**
  String get accountSettingsEmail;

  /// The row of the account's display name
  ///
  /// In vi, this message translates to:
  /// **'Tên hiển thị'**
  String get accountSettingsDisplayName;

  /// The display name when there is none
  ///
  /// In vi, this message translates to:
  /// **'Chưa có'**
  String get accountSettingsNoDisplayName;

  /// The row of the sellers the person owns or works for
  ///
  /// In vi, this message translates to:
  /// **'Quán của bạn'**
  String get accountSettingsSellers;

  /// The role of an owner of a seller
  ///
  /// In vi, this message translates to:
  /// **'Chủ quán'**
  String get accountSettingsOwner;

  /// The role of a staff member of a seller
  ///
  /// In vi, this message translates to:
  /// **'Nhân viên'**
  String get accountSettingsStaff;

  /// The row of the app's language
  ///
  /// In vi, this message translates to:
  /// **'Ngôn ngữ'**
  String get accountSettingsLanguage;

  /// The name of the language on screen
  ///
  /// In vi, this message translates to:
  /// **'Tiếng Việt'**
  String get accountSettingsLanguageName;

  /// The heading at the foot of account settings
  ///
  /// In vi, this message translates to:
  /// **'Xoá tài khoản'**
  String get accountSettingsDeleteTitle;

  /// What deleting the account means, at the foot of account settings
  ///
  /// In vi, this message translates to:
  /// **'Xoá vĩnh viễn tài khoản và dữ liệu cá nhân của bạn. Việc xoá không thể hoàn tác; quán bạn là chủ sẽ bị đóng.'**
  String get accountSettingsDeleteBody;

  /// The button that opens the deletion
  ///
  /// In vi, this message translates to:
  /// **'Xoá tài khoản'**
  String get accountSettingsDeleteAction;

  /// The request's reference after the server's words, quoted when a person reports a failure
  ///
  /// In vi, this message translates to:
  /// **'Mã tham chiếu: {reference}'**
  String problemReference(String reference);

  /// The heading of the sheet that changes the display name, and the row's hint
  ///
  /// In vi, this message translates to:
  /// **'Sửa tên hiển thị'**
  String get accountSettingsEditName;

  /// Saves the display name
  ///
  /// In vi, this message translates to:
  /// **'Lưu'**
  String get accountSettingsSave;

  /// While the display name is saved
  ///
  /// In vi, this message translates to:
  /// **'Đang lưu…'**
  String get accountSettingsSaving;

  /// Closes the sheet without saving
  ///
  /// In vi, this message translates to:
  /// **'Huỷ'**
  String get accountSettingsCancel;

  /// When saving the name got no answer
  ///
  /// In vi, this message translates to:
  /// **'Chưa lưu được tên. Thử lại sau ít phút.'**
  String get accountSettingsNameFailed;
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
