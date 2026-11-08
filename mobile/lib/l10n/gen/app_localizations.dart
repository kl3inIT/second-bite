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

  /// The area under the header's place while every shop is shown
  ///
  /// In vi, this message translates to:
  /// **'Hà Nội'**
  String get homeArea;

  /// What the search field is for, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Tìm món hoặc quán'**
  String get homeSearchLabel;

  /// Hint in the empty search field
  ///
  /// In vi, this message translates to:
  /// **'Tìm bánh, gà rán, pizza…'**
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
  /// **'{kind, select, bakery{Bánh} prepared_food{Món chín} ingredients{Nguyên liệu} drinks{Đồ uống} mixed_box{Hộp tổng hợp} dessert{Tráng miệng} snacks{Ăn vặt} produce{Rau củ quả} other{Khác}}'**
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
  /// **'Bạn xem, tìm và đặt món mà không cần tài khoản; khi đặt, bạn cho quán tên và số điện thoại của người đến lấy. Bạn cần đăng nhập để theo dõi quán hoặc đăng món cho một quán.\n\nHãy giữ an toàn hộp thư và tài khoản Google bạn dùng để đăng nhập, và không đăng nhập thay người khác.'**
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
  /// **'Mã đăng nhập: xóa khi dùng xong, khi bạn xin mã mới, hoặc muộn nhất một ngày sau khi gửi.\n\nPhiên đăng nhập: hết hạn sau 30 ngày không dùng; xóa khi bạn đăng xuất.\n\nẢnh tải lên nhưng không dùng cho món hay quán nào: xóa sau một ngày.\n\nTài khoản, quán, món đã đăng và đơn hàng: giữ cho tới khi bạn xóa tài khoản hoặc yêu cầu xóa, trừ phần pháp luật buộc phải giữ lâu hơn.\n\nKhi bạn xóa tài khoản: tài khoản, phiên đăng nhập, liên kết Google, mã đăng nhập và bản ghi các email gửi cho bạn bị xóa ngay; tư cách thành viên ở các quán và ảnh chưa dùng bị xóa trong vài phút sau đó. Món đã đăng, ảnh món và ảnh quán thuộc về quán nên được giữ, không còn gắn với bạn; quán bạn là chủ sẽ bị đóng. Đơn hàng của bạn: tên, số điện thoại và đồng ý nhận tin qua Zalo bị xóa khỏi đơn, cùng cuộc trò chuyện với quán; quán giữ lại số đơn, món, số tiền và trạng thái để đối soát, không còn gắn với bạn.'**
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
  /// **'Cookie phiên đăng nhập (sắp có), để giữ bạn đăng nhập.\n\nCookie ngôn ngữ, nhớ bạn chọn tiếng Việt hay tiếng Anh trong một năm.\n\nCookie nơi xem món, nhớ khu bạn đã chọn (một điểm làm tròn khoảng 100 m và tên khu) trong 180 ngày; chọn “Tất cả quán” để xoá.\n\nMột dấu trong bộ nhớ trình duyệt, nhớ bạn đã đóng phần giới thiệu.\n\nChúng tôi không dùng cookie quảng cáo hay công cụ theo dõi của bên thứ ba.'**
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
  /// **'Đơn hàng: số đơn, món, số tiền và trạng thái, để quán đối soát; tên, số điện thoại và đồng ý nhận tin qua Zalo trên đơn bị xoá, cùng cuộc trò chuyện với quán.'**
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

  /// Tonight's window across the store's dishes
  ///
  /// In vi, this message translates to:
  /// **'Nhận hôm nay {from}–{until}'**
  String sellerWindow(String from, String until);

  /// Opens the way to the store in the phone's maps
  ///
  /// In vi, this message translates to:
  /// **'Chỉ đường ›'**
  String get sellerDirections;

  /// The tabs by kind, to a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Loại món'**
  String get sellerKinds;

  /// The tab with every kind
  ///
  /// In vi, this message translates to:
  /// **'Đang giảm'**
  String get sellerOnSale;

  /// The heading over the store's dishes
  ///
  /// In vi, this message translates to:
  /// **'Đang giảm tối nay'**
  String get sellerTonight;

  /// A store with nothing on sale
  ///
  /// In vi, this message translates to:
  /// **'Quán chưa có món tối nay'**
  String get sellerNothing;

  /// The way home from a store with nothing on sale
  ///
  /// In vi, this message translates to:
  /// **'Xem món khác'**
  String get sellerHome;

  /// A search of the store's dishes found none
  ///
  /// In vi, this message translates to:
  /// **'Không có món nào khớp “{q}”'**
  String sellerNoMatch(String q);

  /// The share button on the store's cover
  ///
  /// In vi, this message translates to:
  /// **'Chia sẻ quán'**
  String get sellerShare;

  /// The store's search field
  ///
  /// In vi, this message translates to:
  /// **'Tìm trong thực đơn {seller}'**
  String sellerSearch(String seller);

  /// The heading over what the store says of a dish
  ///
  /// In vi, this message translates to:
  /// **'Về món này'**
  String get dishAbout;

  /// A dish's weight
  ///
  /// In vi, this message translates to:
  /// **'Khoảng {grams} g.'**
  String dishWeight(int grams);

  /// The heading over what to bring and ask
  ///
  /// In vi, this message translates to:
  /// **'Lưu ý'**
  String get dishNotes;

  /// What to bring
  ///
  /// In vi, this message translates to:
  /// **'Nên mang túi hoặc hộp riêng.'**
  String get dishBringBag;

  /// What to ask
  ///
  /// In vi, this message translates to:
  /// **'Hỏi quán về thành phần và dị ứng.'**
  String get dishAskSeller;

  /// Who answers for the food, before the link to the terms
  ///
  /// In vi, this message translates to:
  /// **'Second Bite chỉ kết nối bạn với quán; quán chịu trách nhiệm về chất lượng và vệ sinh an toàn thực phẩm của món.'**
  String get dishSellerAnswers;

  /// The link to the terms on a dish's sheet
  ///
  /// In vi, this message translates to:
  /// **'Điều khoản'**
  String get dishTerms;

  /// The sheet's count, to a screen reader
  ///
  /// In vi, this message translates to:
  /// **'{count} phần {name} sẽ thêm'**
  String dishCount(int count, String name);

  /// The sheet's button with what it adds costs
  ///
  /// In vi, this message translates to:
  /// **'Thêm vào giỏ · {price}'**
  String dishAdd(String price);

  /// The sheet's button once the cart holds every portion left
  ///
  /// In vi, this message translates to:
  /// **'Đã chọn đủ {units} phần'**
  String dishAllChosen(int units);

  /// The + of a dish
  ///
  /// In vi, this message translates to:
  /// **'Thêm một phần {name}'**
  String cartAdd(String name);

  /// The − of a dish
  ///
  /// In vi, this message translates to:
  /// **'Bớt một phần {name}'**
  String cartRemove(String name);

  /// The count of a dish in the cart, to a screen reader
  ///
  /// In vi, this message translates to:
  /// **'{quantity} phần {name} trong giỏ'**
  String cartQuantity(int quantity, String name);

  /// The cart bar's line
  ///
  /// In vi, this message translates to:
  /// **'{units} phần · tiết kiệm {saved}'**
  String cartSummary(int units, String saved);

  /// Under a dish on its store's page
  ///
  /// In vi, this message translates to:
  /// **'còn {units} phần'**
  String cartPortionsLeft(int units);

  /// Under a dish once the cart holds every portion left
  ///
  /// In vi, this message translates to:
  /// **'đã chọn đủ {units} phần'**
  String cartPortionsChosen(int units);

  /// Under a dish once the cart holds the most one order may (SEC-158)
  ///
  /// In vi, this message translates to:
  /// **'tối đa {units} phần mỗi đơn'**
  String cartPortionsCapped(int units);

  /// The dish sheet's button once the cart holds the most one order may
  ///
  /// In vi, this message translates to:
  /// **'Đã chọn tối đa {units} phần mỗi đơn'**
  String dishCapChosen(int units);

  /// Under the dish sheet's button when the dish has a cap below its portions left
  ///
  /// In vi, this message translates to:
  /// **'Tối đa {units} phần mỗi đơn'**
  String dishPerOrder(int units);

  /// The cart page's title
  ///
  /// In vi, this message translates to:
  /// **'Xác nhận đơn'**
  String get cartTitle;

  /// Closes a sheet of the cart
  ///
  /// In vi, this message translates to:
  /// **'Đóng'**
  String get cartClose;

  /// The cart bar's button
  ///
  /// In vi, this message translates to:
  /// **'Xem giỏ hàng'**
  String get cartOpen;

  /// The cart page with nothing in it
  ///
  /// In vi, this message translates to:
  /// **'Giỏ hàng đang trống'**
  String get cartEmpty;

  /// From the empty cart to the home
  ///
  /// In vi, this message translates to:
  /// **'Xem món tối nay'**
  String get cartBrowse;

  /// A store's way there on the cart
  ///
  /// In vi, this message translates to:
  /// **'Chỉ đường'**
  String get cartDirections;

  /// Under a store's name on the cart
  ///
  /// In vi, this message translates to:
  /// **'{place} · Nhận {from} – {until}'**
  String cartSellerWindow(String place, String from, String until);

  /// A dish in the cart whose window has closed
  ///
  /// In vi, this message translates to:
  /// **'Hết giờ nhận'**
  String get cartOver;

  /// The bin of a dish whose window has closed, to a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Bỏ {name} khỏi giỏ'**
  String cartDropLabel(String name);

  /// The cart's payment section
  ///
  /// In vi, this message translates to:
  /// **'Thanh toán'**
  String get cartPay;

  /// Paying at the counter, the only way in the pilot
  ///
  /// In vi, this message translates to:
  /// **'Thanh toán tại quầy'**
  String get cartCounter;

  /// Paying by transfer, not yet possible
  ///
  /// In vi, this message translates to:
  /// **'Chuyển khoản'**
  String get cartTransfer;

  /// Beside a way to pay that is not yet possible
  ///
  /// In vi, this message translates to:
  /// **'(sắp có)'**
  String get cartSoon;

  /// The cart's summary heading
  ///
  /// In vi, this message translates to:
  /// **'{orders, plural, =1{Tổng cộng} other{Tổng cộng · {orders} đơn}}'**
  String cartSummaryTitle(int orders);

  /// The dishes' cost in the summary
  ///
  /// In vi, this message translates to:
  /// **'Tiền món ({units} phần)'**
  String cartDishes(int units);

  /// The cart's total
  ///
  /// In vi, this message translates to:
  /// **'Tổng tiền'**
  String get cartTotal;

  /// The cart's cancellation heading
  ///
  /// In vi, this message translates to:
  /// **'Chính sách huỷ'**
  String get cartCancelTitle;

  /// The cart's cancellation policy
  ///
  /// In vi, this message translates to:
  /// **'Huỷ được cho tới khi quán báo món sẵn sàng.'**
  String get cartCancelBody;

  /// The cart page's bar
  ///
  /// In vi, this message translates to:
  /// **'{orders, plural, =1{Tổng {units} phần} other{{orders} đơn · {units} phần}} · tiết kiệm {saved}'**
  String cartTotalSummary(int orders, int units, String saved);

  /// Places the cart's orders
  ///
  /// In vi, this message translates to:
  /// **'{orders, plural, =1{Đặt món} other{Đặt {orders} đơn}}'**
  String cartOrder(int orders);

  /// The contact sheet's title
  ///
  /// In vi, this message translates to:
  /// **'Người đến nhận'**
  String get cartContactTitle;

  /// Under the contact sheet's title
  ///
  /// In vi, this message translates to:
  /// **'Quán gọi tên này khi bạn đến và gọi số này nếu cần.'**
  String get cartContactHint;

  /// The collector's name field
  ///
  /// In vi, this message translates to:
  /// **'Tên'**
  String get cartNameLabel;

  /// The collector's phone field
  ///
  /// In vi, this message translates to:
  /// **'Số điện thoại'**
  String get cartPhoneLabel;

  /// A name that cannot be sent
  ///
  /// In vi, this message translates to:
  /// **'Nhập tên từ 1 đến 50 ký tự.'**
  String get cartNameInvalid;

  /// A phone number that cannot be sent
  ///
  /// In vi, this message translates to:
  /// **'Nhập số điện thoại 10 số, bắt đầu bằng 0.'**
  String get cartPhoneInvalid;

  /// The contact sheet's button
  ///
  /// In vi, this message translates to:
  /// **'Tiếp tục'**
  String get cartContactSubmit;

  /// The dialog that checks the number once
  ///
  /// In vi, this message translates to:
  /// **'Xác nhận đặt đơn với số điện thoại'**
  String get cartConfirmTitle;

  /// Confirms the number and places the orders
  ///
  /// In vi, this message translates to:
  /// **'Đúng, đặt món'**
  String get cartConfirmYes;

  /// Back to the contact sheet
  ///
  /// In vi, this message translates to:
  /// **'Sửa'**
  String get cartConfirmEdit;

  /// One dish someone else ordered first
  ///
  /// In vi, this message translates to:
  /// **'{name} vừa hết'**
  String cartGoneOne(String name);

  /// Several dishes someone else ordered first
  ///
  /// In vi, this message translates to:
  /// **'{count} món vừa hết'**
  String cartGoneMany(int count);

  /// Under a sold-out title
  ///
  /// In vi, this message translates to:
  /// **'Người khác vừa đặt phần cuối. Bạn chưa bị tính tiền.'**
  String get cartGoneBody;

  /// One dish with fewer portions left than chosen
  ///
  /// In vi, this message translates to:
  /// **'{name} chỉ còn {left} phần'**
  String cartFewerOne(String name, int left);

  /// Several dishes with fewer portions left
  ///
  /// In vi, this message translates to:
  /// **'{count} món còn ít phần hơn bạn chọn'**
  String cartFewerMany(int count);

  /// Under a fewer-portions title
  ///
  /// In vi, this message translates to:
  /// **'Người khác vừa đặt trước bạn. Bạn chưa bị tính tiền.'**
  String get cartFewerBody;

  /// Places what is left after a dish sold out
  ///
  /// In vi, this message translates to:
  /// **'Đặt {what} · {price}'**
  String cartOrderRest(String what, String price);

  /// A dish and its portions
  ///
  /// In vi, this message translates to:
  /// **'{quantity}× {name}'**
  String cartLine(int quantity, String name);

  /// What is left of a basket
  ///
  /// In vi, this message translates to:
  /// **'{units} phần còn lại'**
  String cartRestUnits(int units);

  /// From the sold-out sheet to the store
  ///
  /// In vi, this message translates to:
  /// **'Xem món khác của quán'**
  String get cartOtherDishes;

  /// Placing failed without an answer
  ///
  /// In vi, this message translates to:
  /// **'Chưa đặt được món. Kiểm tra mạng rồi thử lại.'**
  String get cartOrderFailedPlain;

  /// A promotion's rule without a minimum
  ///
  /// In vi, this message translates to:
  /// **'{rule}: giảm {amount}'**
  String cartPromotionRule(String rule, String amount);

  /// A promotion's rule with a minimum
  ///
  /// In vi, this message translates to:
  /// **'{rule}: giảm {amount} cho đơn từ {from}'**
  String cartPromotionRuleFrom(String rule, String amount, String from);

  /// A percentage taken off, with its most
  ///
  /// In vi, this message translates to:
  /// **'{value}% (tối đa {max})'**
  String cartPromotionPercent(int value, String max);

  /// How often a phone number gets a promotion
  ///
  /// In vi, this message translates to:
  /// **'Mỗi số điện thoại được giảm {count} lần mỗi ngày.'**
  String cartPromotionPerDay(int count);

  /// Under the running promotions
  ///
  /// In vi, this message translates to:
  /// **'Số tiền giảm hiện trên đơn ngay sau khi đặt; bạn trả ít hơn tại quầy.'**
  String get cartPromotionAfter;

  /// The Orders tab's title
  ///
  /// In vi, this message translates to:
  /// **'Đơn của tôi'**
  String get ordersTitle;

  /// The label of the two lists of orders
  ///
  /// In vi, this message translates to:
  /// **'Danh sách đơn'**
  String get ordersLists;

  /// The list of orders still to collect, with how many
  ///
  /// In vi, this message translates to:
  /// **'Đang chờ nhận ({count})'**
  String ordersTabOpen(int count);

  /// The list of orders that ended
  ///
  /// In vi, this message translates to:
  /// **'Đã xong'**
  String get ordersTabEnded;

  /// No order still to collect
  ///
  /// In vi, this message translates to:
  /// **'Bạn chưa có đơn nào đang chờ nhận.'**
  String get ordersNoneOpen;

  /// No ended order
  ///
  /// In vi, this message translates to:
  /// **'Chưa có đơn nào đã xong.'**
  String get ordersNoneEnded;

  /// A ready order, until when to collect it
  ///
  /// In vi, this message translates to:
  /// **'Sẵn sàng · đến {until}'**
  String ordersReadyUntil(String until);

  /// An order the store is preparing
  ///
  /// In vi, this message translates to:
  /// **'Đang chuẩn bị'**
  String get ordersPreparing;

  /// An open order's number, what to pay and its window
  ///
  /// In vi, this message translates to:
  /// **'#{number} · {total} · nhận {from}–{until}'**
  String ordersCardMetaWindow(
    String number,
    String total,
    String from,
    String until,
  );

  /// A ready order's number and what to pay
  ///
  /// In vi, this message translates to:
  /// **'#{number} · {total} · trả khi nhận'**
  String ordersCardMetaReady(String number, String total);

  /// Opens a ready order's QR code
  ///
  /// In vi, this message translates to:
  /// **'Xem mã QR nhận món'**
  String get ordersSeeQr;

  /// Opens an order
  ///
  /// In vi, this message translates to:
  /// **'Xem đơn'**
  String get ordersSeeOrder;

  /// Ended orders of today
  ///
  /// In vi, this message translates to:
  /// **'Hôm nay'**
  String get ordersDayToday;

  /// Ended orders of the six days before
  ///
  /// In vi, this message translates to:
  /// **'Tuần này'**
  String get ordersDayWeek;

  /// Ended orders before that
  ///
  /// In vi, this message translates to:
  /// **'Trước đó'**
  String get ordersDayBefore;

  /// A day and month
  ///
  /// In vi, this message translates to:
  /// **'{day}/{month}'**
  String ordersDate(int day, int month);

  /// An order confirmed
  ///
  /// In vi, this message translates to:
  /// **'Đã xác nhận'**
  String get ordersEndedLineConfirmed;

  /// An order ready
  ///
  /// In vi, this message translates to:
  /// **'Sẵn sàng'**
  String get ordersEndedLineReady;

  /// An order collected
  ///
  /// In vi, this message translates to:
  /// **'Đã nhận'**
  String get ordersEndedLineCollected;

  /// An order cancelled
  ///
  /// In vi, this message translates to:
  /// **'Đã huỷ · không thu tiền'**
  String get ordersEndedLineCancelled;

  /// An order the store refused
  ///
  /// In vi, this message translates to:
  /// **'Quán không giao · không thu tiền'**
  String get ordersEndedLineRefused;

  /// An order nobody collected
  ///
  /// In vi, this message translates to:
  /// **'Hết hạn, không đến nhận'**
  String get ordersEndedLineExpired;

  /// No order known to this phone
  ///
  /// In vi, this message translates to:
  /// **'Chưa thấy đơn nào'**
  String get ordersSignInTitle;

  /// Why to sign in to see orders
  ///
  /// In vi, this message translates to:
  /// **'Chưa có đơn nào đặt trên ứng dụng này. Nếu bạn đặt khi đã đăng nhập, đăng nhập để xem.'**
  String get ordersSignInBody;

  /// An order's title
  ///
  /// In vi, this message translates to:
  /// **'Đơn #{number}'**
  String orderNumber(String number);

  /// A confirmed order, on the blue band
  ///
  /// In vi, this message translates to:
  /// **'Đã xác nhận · quán đang chuẩn bị'**
  String get orderHeadlineConfirmed;

  /// A ready order, on the blue band
  ///
  /// In vi, this message translates to:
  /// **'Món đã sẵn sàng'**
  String get orderHeadlineReady;

  /// How long until the window opens
  ///
  /// In vi, this message translates to:
  /// **'Nhận hôm nay · mở sau {left}'**
  String orderOpensIn(String left);

  /// How long until the window closes
  ///
  /// In vi, this message translates to:
  /// **'Nhận hôm nay · còn {left}'**
  String orderClosesIn(String left);

  /// A span in hours and minutes
  ///
  /// In vi, this message translates to:
  /// **'{hours} giờ {minutes} phút'**
  String orderHoursMinutes(int hours, int minutes);

  /// A span in minutes
  ///
  /// In vi, this message translates to:
  /// **'{minutes} phút'**
  String orderMinutes(int minutes);

  /// The store's counter and today's window
  ///
  /// In vi, this message translates to:
  /// **'{address} · {from}–{until} hôm nay'**
  String orderCounterToday(String address, String from, String until);

  /// How many portions an order holds
  ///
  /// In vi, this message translates to:
  /// **'{units} phần'**
  String orderUnits(int units);

  /// How to collect a ready order
  ///
  /// In vi, this message translates to:
  /// **'Đưa mã QR cho quầy quét hoặc đọc tên, số điện thoại để nhận món.'**
  String get orderCollectReady;

  /// How to collect an order not ready yet
  ///
  /// In vi, this message translates to:
  /// **'Mã QR hiện khi món sẵn sàng. Có thể đọc tên, số điện thoại để nhận món.'**
  String get orderCollectLater;

  /// What a screen reader says of the QR code
  ///
  /// In vi, this message translates to:
  /// **'Mã QR nhận đơn #{number}'**
  String orderQrLabel(String number);

  /// Another store's order placed from the same cart
  ///
  /// In vi, this message translates to:
  /// **'Cùng lần đặt: {seller}'**
  String orderPlacedWith(String seller);

  /// How to collect an order
  ///
  /// In vi, this message translates to:
  /// **'Cách nhận món'**
  String get orderHowTitle;

  /// First step of collecting
  ///
  /// In vi, this message translates to:
  /// **'Đến quầy thu ngân'**
  String get orderHowGoTitle;

  /// Second step of collecting
  ///
  /// In vi, this message translates to:
  /// **'Đưa mã QR'**
  String get orderHowQrTitle;

  /// Second step of collecting, its line
  ///
  /// In vi, this message translates to:
  /// **'hoặc đọc tên, số ĐT'**
  String get orderHowQrBody;

  /// Third step of collecting
  ///
  /// In vi, this message translates to:
  /// **'Nhận món'**
  String get orderHowTakeTitle;

  /// Third step of collecting, its line
  ///
  /// In vi, this message translates to:
  /// **'Nhớ mang túi riêng'**
  String get orderHowTakeBody;

  /// The order's four steps
  ///
  /// In vi, this message translates to:
  /// **'Các bước của đơn'**
  String get orderStepsLabel;

  /// Step: placed
  ///
  /// In vi, this message translates to:
  /// **'Đã đặt'**
  String get orderStepPlaced;

  /// Step: preparing
  ///
  /// In vi, this message translates to:
  /// **'Chuẩn bị'**
  String get orderStepPreparing;

  /// Step: ready
  ///
  /// In vi, this message translates to:
  /// **'Sẵn sàng'**
  String get orderStepReady;

  /// Step: collected
  ///
  /// In vi, this message translates to:
  /// **'Hoàn tất'**
  String get orderStepCollected;

  /// The order's dishes, with how many portions
  ///
  /// In vi, this message translates to:
  /// **'Món đã đặt · {units} phần'**
  String orderOrdered(int units);

  /// A price struck through, for a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Giá gốc'**
  String get orderOriginalPrice;

  /// What the order saved
  ///
  /// In vi, this message translates to:
  /// **'Tiết kiệm'**
  String get orderFactSaved;

  /// What the order saved, its amount
  ///
  /// In vi, this message translates to:
  /// **'{saved} so với giá gốc'**
  String orderFactSavedValue(String saved);

  /// The order's total
  ///
  /// In vi, this message translates to:
  /// **'Tổng'**
  String get orderFactTotal;

  /// What is paid at the counter after a discount
  ///
  /// In vi, this message translates to:
  /// **'Trả tại quầy'**
  String get orderFactPayAtCounter;

  /// A total struck through, for a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Giá trước khi giảm'**
  String get orderFactBeforeDiscount;

  /// The order's number
  ///
  /// In vi, this message translates to:
  /// **'Mã đơn'**
  String get orderFactNumber;

  /// How the order is paid
  ///
  /// In vi, this message translates to:
  /// **'Thanh toán'**
  String get orderFactPayment;

  /// Paid at the counter
  ///
  /// In vi, this message translates to:
  /// **'Thanh toán tại quầy'**
  String get orderFactAtCounter;

  /// Nothing charged for an order that ended
  ///
  /// In vi, this message translates to:
  /// **'Không thu tiền'**
  String get orderFactNothing;

  /// The promotion and rule that took something off
  ///
  /// In vi, this message translates to:
  /// **'{promotion} · {rule}'**
  String orderFactDiscount(String promotion, String rule);

  /// The way to the counter
  ///
  /// In vi, this message translates to:
  /// **'Đường đến quầy'**
  String get orderDirectionsLabel;

  /// The store and its counter
  ///
  /// In vi, this message translates to:
  /// **'{seller} · {address}'**
  String orderPlaceLine(String seller, String address);

  /// Opens the way in the phone's maps
  ///
  /// In vi, this message translates to:
  /// **'Chỉ đường'**
  String get orderDirections;

  /// Back to tonight's dishes
  ///
  /// In vi, this message translates to:
  /// **'Xem món khác'**
  String get orderSeeOthers;

  /// When a collected order was collected
  ///
  /// In vi, this message translates to:
  /// **'Đã nhận món lúc {time}'**
  String orderCollectedAt(String time);

  /// What a collected order saved
  ///
  /// In vi, this message translates to:
  /// **'Tiết kiệm so với giá gốc · {units} phần không bị bỏ phí'**
  String orderSavedLine(int units);

  /// A rated order's receipt badge
  ///
  /// In vi, this message translates to:
  /// **'Đã nhận món lúc {time} · {date}'**
  String orderEndedAtCollected(String time, String date);

  /// A cancelled order's receipt badge
  ///
  /// In vi, this message translates to:
  /// **'Đơn đã huỷ'**
  String get orderEndedBadgeCancelled;

  /// A refused order's receipt badge
  ///
  /// In vi, this message translates to:
  /// **'Quán không giao đơn này'**
  String get orderEndedBadgeRefused;

  /// An expired order's receipt badge
  ///
  /// In vi, this message translates to:
  /// **'Đơn đã hết hạn'**
  String get orderEndedBadgeExpired;

  /// What happened to an order
  ///
  /// In vi, this message translates to:
  /// **'Trạng thái'**
  String get orderTimelineTitle;

  /// Moment: placed
  ///
  /// In vi, this message translates to:
  /// **'Bạn đã đặt đơn'**
  String get orderTimelinePlaced;

  /// Moment: placed, its line
  ///
  /// In vi, this message translates to:
  /// **'{date}, {time} · {units} phần · {total}'**
  String orderTimelinePlacedBody(
    String date,
    String time,
    int units,
    String total,
  );

  /// Moment: confirmed
  ///
  /// In vi, this message translates to:
  /// **'Quán xác nhận đơn'**
  String get orderTimelineConfirmed;

  /// Moment: confirmed, its line
  ///
  /// In vi, this message translates to:
  /// **'{time} · giữ {units} phần cho bạn'**
  String orderTimelineConfirmedBody(String time, int units);

  /// Moment: cancelled
  ///
  /// In vi, this message translates to:
  /// **'Bạn đã huỷ đơn'**
  String get orderTimelineCancelled;

  /// A moment with its reason
  ///
  /// In vi, this message translates to:
  /// **'{time} · {reason}'**
  String orderTimelineWithReason(String time, String reason);

  /// Moment: portions returned
  ///
  /// In vi, this message translates to:
  /// **'{units} phần đã trả lại cho quán'**
  String orderTimelineReturned(int units);

  /// Moment: portions returned, its line
  ///
  /// In vi, this message translates to:
  /// **'Người khác có thể đặt'**
  String get orderTimelineReturnedBody;

  /// Moment: ready
  ///
  /// In vi, this message translates to:
  /// **'Món đã sẵn sàng'**
  String get orderTimelineReady;

  /// Moment: ready, its line
  ///
  /// In vi, this message translates to:
  /// **'{time} · quán báo bạn đến nhận'**
  String orderTimelineReadyBody(String time);

  /// Moment: ready, of an expired order
  ///
  /// In vi, this message translates to:
  /// **'{date}, {time} · đã báo cho bạn'**
  String orderTimelineToldBody(String date, String time);

  /// Moment: collected
  ///
  /// In vi, this message translates to:
  /// **'Bạn đã nhận món'**
  String get orderTimelineCollected;

  /// Moment: collected, its line
  ///
  /// In vi, this message translates to:
  /// **'{time} · đã trả {total}'**
  String orderTimelineCollectedBody(String time, String total);

  /// Moment: collected and rated
  ///
  /// In vi, this message translates to:
  /// **'{time} · đã trả {total} · bạn chấm {stars} sao'**
  String orderTimelineCollectedRated(String time, String total, int stars);

  /// Moment: refused
  ///
  /// In vi, this message translates to:
  /// **'Quán từ chối giao'**
  String get orderTimelineRefused;

  /// Moment: refused, its line
  ///
  /// In vi, this message translates to:
  /// **'{time} · lý do: {reason}'**
  String orderTimelineRefusedBody(String time, String reason);

  /// Moment: expired
  ///
  /// In vi, this message translates to:
  /// **'Hết giờ nhận'**
  String get orderTimelineExpired;

  /// Moment: expired, its line
  ///
  /// In vi, this message translates to:
  /// **'{until} · đơn ghi là không nhận'**
  String orderTimelineExpiredBody(String until);

  /// What a cancelled order means
  ///
  /// In vi, this message translates to:
  /// **'Bạn chưa trả tiền nên không có gì phải hoàn.'**
  String get orderTimelineSummaryCancelled;

  /// What a refused order means
  ///
  /// In vi, this message translates to:
  /// **'Quán không giao được đơn: {reason}. Bạn không phải trả tiền.'**
  String orderTimelineSummaryRefused(String reason);

  /// What an expired order means
  ///
  /// In vi, this message translates to:
  /// **'Không ai đến nhận trước {until}. Lần sau nếu không kịp, hãy huỷ đơn để món đến được người khác.'**
  String orderTimelineSummaryExpired(String until);

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'món không còn phù hợp'**
  String get orderRefuseReasonNotSuitable;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'món không đúng với đơn'**
  String get orderRefuseReasonWrongItems;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'quán không gọi được cho bạn'**
  String get orderRefuseReasonNoAnswer;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'bạn chưa đến nhận'**
  String get orderRefuseReasonNoShow;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'đã quá giờ nhận'**
  String get orderRefuseReasonLate;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'món đã hết'**
  String get orderRefuseReasonSoldOut;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'lý do khác'**
  String get orderRefuseReasonOther;

  /// Why the store refused an order
  ///
  /// In vi, this message translates to:
  /// **'quán đã rút bài này'**
  String get orderRefuseReasonWithdrawn;

  /// Opens cancelling
  ///
  /// In vi, this message translates to:
  /// **'Huỷ đơn'**
  String get orderCancelOpen;

  /// The cancel sheet's title
  ///
  /// In vi, this message translates to:
  /// **'Huỷ đơn #{number}?'**
  String orderCancelTitle(String number);

  /// What cancelling does
  ///
  /// In vi, this message translates to:
  /// **'{units} phần sẽ trả lại cho {seller} để người khác đặt.'**
  String orderCancelBody(int units, String seller);

  /// The reasons to cancel
  ///
  /// In vi, this message translates to:
  /// **'Lý do huỷ (không bắt buộc)'**
  String get orderCancelReason;

  /// A reason to cancel
  ///
  /// In vi, this message translates to:
  /// **'Không đến kịp'**
  String get orderCancelReasonLate;

  /// A reason to cancel
  ///
  /// In vi, this message translates to:
  /// **'Đặt nhầm'**
  String get orderCancelReasonMistake;

  /// A reason to cancel
  ///
  /// In vi, this message translates to:
  /// **'Lý do khác'**
  String get orderCancelReasonOther;

  /// Closes the cancel sheet
  ///
  /// In vi, this message translates to:
  /// **'Giữ đơn'**
  String get orderCancelKeep;

  /// Cancels the order
  ///
  /// In vi, this message translates to:
  /// **'Huỷ đơn'**
  String get orderCancelConfirm;

  /// Cancelling failed without an answer
  ///
  /// In vi, this message translates to:
  /// **'Chưa huỷ được đơn. Thử lại sau ít phút.'**
  String get orderCancelFailed;

  /// The rating's title
  ///
  /// In vi, this message translates to:
  /// **'Món hôm nay thế nào?'**
  String get reviewTitle;

  /// Why to rate
  ///
  /// In vi, this message translates to:
  /// **'Đánh giá giúp quán và người mua sau.'**
  String get reviewHint;

  /// The stars to choose
  ///
  /// In vi, this message translates to:
  /// **'Số sao'**
  String get reviewStarsLegend;

  /// A number of stars
  ///
  /// In vi, this message translates to:
  /// **'{count} sao'**
  String reviewStar(int count);

  /// The word for 1 stars
  ///
  /// In vi, this message translates to:
  /// **'Tệ'**
  String get reviewWord1;

  /// The word for 2 stars
  ///
  /// In vi, this message translates to:
  /// **'Chưa ổn'**
  String get reviewWord2;

  /// The word for 3 stars
  ///
  /// In vi, this message translates to:
  /// **'Bình thường'**
  String get reviewWord3;

  /// The word for 4 stars
  ///
  /// In vi, this message translates to:
  /// **'Tốt'**
  String get reviewWord4;

  /// The word for 5 stars
  ///
  /// In vi, this message translates to:
  /// **'Tuyệt vời'**
  String get reviewWord5;

  /// What went well
  ///
  /// In vi, this message translates to:
  /// **'Điều gì làm bạn hài lòng?'**
  String get reviewTagsTitle;

  /// What went well
  ///
  /// In vi, this message translates to:
  /// **'Nhận hàng nhanh'**
  String get reviewTagFastPickup;

  /// What went well
  ///
  /// In vi, this message translates to:
  /// **'Chất lượng tốt'**
  String get reviewTagGoodQuality;

  /// What went well
  ///
  /// In vi, this message translates to:
  /// **'Đa dạng món'**
  String get reviewTagGoodVariety;

  /// What went well
  ///
  /// In vi, this message translates to:
  /// **'Đủ số lượng'**
  String get reviewTagFairPortions;

  /// The rating's comment
  ///
  /// In vi, this message translates to:
  /// **'Viết vài dòng cho quán (không bắt buộc)'**
  String get reviewComment;

  /// Sends the rating
  ///
  /// In vi, this message translates to:
  /// **'Gửi đánh giá'**
  String get reviewSubmit;

  /// Rating failed without an answer
  ///
  /// In vi, this message translates to:
  /// **'Chưa gửi được đánh giá. Thử lại sau ít phút.'**
  String get reviewFailed;

  /// The rating given
  ///
  /// In vi, this message translates to:
  /// **'Bạn đã đánh giá'**
  String get reviewGiven;

  /// Thanks for rating
  ///
  /// In vi, this message translates to:
  /// **'Cảm ơn bạn, quán sẽ đọc đánh giá này.'**
  String get reviewThanks;

  /// No star chosen
  ///
  /// In vi, this message translates to:
  /// **'Chọn số sao cho đơn.'**
  String get reviewErrorStars;

  /// Opens the problem report
  ///
  /// In vi, this message translates to:
  /// **'Báo vấn đề với đơn'**
  String get orderProblemOpen;

  /// The problem sheet's title
  ///
  /// In vi, this message translates to:
  /// **'Đơn #{number} có vấn đề gì?'**
  String orderProblemTitle(String number);

  /// What reporting does
  ///
  /// In vi, this message translates to:
  /// **'Chọn điều chưa ổn. Chúng tôi chuyển cho quán và trả lời bạn.'**
  String get orderProblemBody;

  /// The kinds of problem
  ///
  /// In vi, this message translates to:
  /// **'Điều chưa ổn'**
  String get orderProblemKindLegend;

  /// A kind of problem
  ///
  /// In vi, this message translates to:
  /// **'Thiếu món'**
  String get orderProblemKindMissingItem;

  /// A kind of problem
  ///
  /// In vi, this message translates to:
  /// **'Sai món'**
  String get orderProblemKindWrongItem;

  /// A kind of problem
  ///
  /// In vi, this message translates to:
  /// **'Món không đạt'**
  String get orderProblemKindPoorQuality;

  /// A kind of problem
  ///
  /// In vi, this message translates to:
  /// **'Quán đóng cửa khi đến'**
  String get orderProblemKindStoreClosed;

  /// The problem's note
  ///
  /// In vi, this message translates to:
  /// **'Ghi thêm (không bắt buộc)'**
  String get orderProblemNote;

  /// An example note
  ///
  /// In vi, this message translates to:
  /// **'Ví dụ: thiếu 1 bánh mì chà bông'**
  String get orderProblemNotePlaceholder;

  /// Sends the report
  ///
  /// In vi, this message translates to:
  /// **'Gửi cho quán'**
  String get orderProblemSend;

  /// Closes the problem sheet
  ///
  /// In vi, this message translates to:
  /// **'Để sau'**
  String get orderProblemLater;

  /// Reporting failed without an answer
  ///
  /// In vi, this message translates to:
  /// **'Chưa gửi được. Thử lại sau ít phút.'**
  String get orderProblemFailed;

  /// No kind chosen
  ///
  /// In vi, this message translates to:
  /// **'Chọn điều chưa ổn với đơn.'**
  String get orderProblemErrorKind;

  /// The problem reported
  ///
  /// In vi, this message translates to:
  /// **'Vấn đề bạn đã báo'**
  String get orderProblemReportedTitle;

  /// When the problem was reported, and its note
  ///
  /// In vi, this message translates to:
  /// **'{time} · {note}'**
  String orderProblemNoteAt(String time, String note);

  /// The report went to the store
  ///
  /// In vi, this message translates to:
  /// **'Đã gửi cho {seller}'**
  String orderProblemSent(String seller);

  /// No answer yet
  ///
  /// In vi, this message translates to:
  /// **'Quán sẽ trả lời bạn ở đây'**
  String get orderProblemWaiting;

  /// The store's answer
  ///
  /// In vi, this message translates to:
  /// **'{seller} trả lời · {time}'**
  String orderProblemAnswered(String seller, String time);

  /// What a screen reader says of the unread count
  ///
  /// In vi, this message translates to:
  /// **'{count} tin nhắn chưa đọc'**
  String chatUnread(int count);

  /// The way into an order's chat while it can be written in
  ///
  /// In vi, this message translates to:
  /// **'Nhắn quán'**
  String get chatMessageStore;

  /// The way into an order's chat once it can only be read
  ///
  /// In vi, this message translates to:
  /// **'Xem tin nhắn'**
  String get chatViewMessages;

  /// The unread banner's title on an order's page
  ///
  /// In vi, this message translates to:
  /// **'Quán vừa nhắn'**
  String get chatStoreWrote;

  /// The store's latest message, quoted
  ///
  /// In vi, this message translates to:
  /// **'“{text}”'**
  String chatQuote(String text);

  /// The unread banner's way to the chat
  ///
  /// In vi, this message translates to:
  /// **'Xem tin'**
  String get chatSeeMessage;

  /// The order's card at the head of the chat
  ///
  /// In vi, this message translates to:
  /// **'{units} phần · {from}–{until} hôm nay'**
  String chatCardMeta(int units, String from, String until);

  /// The day line under the order's card
  ///
  /// In vi, this message translates to:
  /// **'Hôm nay · Đơn #{number} đã xác nhận'**
  String chatConfirmedToday(String number);

  /// The day line of an order placed another day
  ///
  /// In vi, this message translates to:
  /// **'{date} · Đơn #{number} đã xác nhận'**
  String chatConfirmedOn(String date, String number);

  /// The chat's messages, for screen readers
  ///
  /// In vi, this message translates to:
  /// **'Tin nhắn của đơn'**
  String get chatLog;

  /// Said before the reader's own message
  ///
  /// In vi, this message translates to:
  /// **'Bạn'**
  String get chatMine;

  /// Under the reader's message once the store read it
  ///
  /// In vi, this message translates to:
  /// **'{time} · Đã xem'**
  String chatSeen(String time);

  /// The note above the field
  ///
  /// In vi, this message translates to:
  /// **'Tin nhắn không đổi giá, số lượng hay giờ nhận của đơn.'**
  String get chatNote;

  /// The chat's field
  ///
  /// In vi, this message translates to:
  /// **'Nhắn cho quán…'**
  String get chatPlaceholderToStore;

  /// The send button, for screen readers
  ///
  /// In vi, this message translates to:
  /// **'Gửi tin nhắn'**
  String get chatSend;

  /// Sends a message that failed again
  ///
  /// In vi, this message translates to:
  /// **'Gửi lại'**
  String get chatRetry;

  /// Under a message that failed to send
  ///
  /// In vi, this message translates to:
  /// **'Chưa gửi được'**
  String get chatFailed;

  /// The row of quick replies, for screen readers
  ///
  /// In vi, this message translates to:
  /// **'Trả lời nhanh'**
  String get chatQuickReplies;

  /// A quick reply
  ///
  /// In vi, this message translates to:
  /// **'Mình đang tới'**
  String get chatReplyComing;

  /// A quick reply
  ///
  /// In vi, this message translates to:
  /// **'Cho mình nhận trễ 10 phút'**
  String get chatReplyLate;

  /// A quick reply
  ///
  /// In vi, this message translates to:
  /// **'Quán còn món không?'**
  String get chatReplyStillHave;

  /// The foot of a chat that can only be read
  ///
  /// In vi, this message translates to:
  /// **'Đơn đã kết thúc, chỉ xem lại tin nhắn.'**
  String get chatLocked;

  /// The header's place while every shop is shown
  ///
  /// In vi, this message translates to:
  /// **'Tất cả quán'**
  String get homePlaceAll;

  /// The header's place when it is the phone's own, without a street
  ///
  /// In vi, this message translates to:
  /// **'Vị trí của tôi'**
  String get homePlaceNearby;

  /// The home's heading as a screen reader hears it, at every shop
  ///
  /// In vi, this message translates to:
  /// **'Tối nay: Tất cả quán'**
  String get homeHeadingAll;

  /// The home's heading as a screen reader hears it, around a place
  ///
  /// In vi, this message translates to:
  /// **'Tối nay quanh {place}'**
  String homeHeadingAround(String place);

  /// Under a place chosen by name on the header
  ///
  /// In vi, this message translates to:
  /// **'Các quán quanh đây'**
  String get homeAreaPlace;

  /// Under the phone's own place on the header
  ///
  /// In vi, this message translates to:
  /// **'Các quán gần bạn'**
  String get homeAreaNearby;

  /// The search field's round button that opens the search with its filters
  ///
  /// In vi, this message translates to:
  /// **'Lọc món'**
  String get homeFilters;

  /// What tapping the header's place does, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Chọn nơi xem món'**
  String get areaOpen;

  /// Title of the area sheet
  ///
  /// In vi, this message translates to:
  /// **'Xem món ở đâu?'**
  String get areaTitle;

  /// Closes the area sheet
  ///
  /// In vi, this message translates to:
  /// **'Đóng'**
  String get areaClose;

  /// The area sheet's field, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Tìm nơi xem món'**
  String get areaField;

  /// Hint in the area sheet's field
  ///
  /// In vi, this message translates to:
  /// **'Gõ địa chỉ, tên khu…'**
  String get areaFieldPlaceholder;

  /// Clears the area sheet's field
  ///
  /// In vi, this message translates to:
  /// **'Xoá chữ đã gõ'**
  String get areaClear;

  /// How many places were suggested, for a screen reader
  ///
  /// In vi, this message translates to:
  /// **'{count, plural, =0{Không có nơi nào} other{{count} nơi gợi ý}}'**
  String areaSuggestions(int count);

  /// No place matches the words typed
  ///
  /// In vi, this message translates to:
  /// **'Không tìm thấy nơi này. Thử tên phường, đường hoặc toà nhà khác, hoặc dùng vị trí của bạn.'**
  String get areaNoPlace;

  /// Name of the area sheet's choices
  ///
  /// In vi, this message translates to:
  /// **'Khu vực'**
  String get areaAreas;

  /// Every shop, the default
  ///
  /// In vi, this message translates to:
  /// **'Tất cả quán'**
  String get areaAll;

  /// Under every shop
  ///
  /// In vi, this message translates to:
  /// **'Mặc định · món sắp hết giờ lên trước'**
  String get areaAllHint;

  /// The mall, suggested
  ///
  /// In vi, this message translates to:
  /// **'Tasco Mall Long Biên'**
  String get areaMall;

  /// Under the mall
  ///
  /// In vi, this message translates to:
  /// **'Gợi ý · các quán trong trung tâm'**
  String get areaMallHint;

  /// Uses the phone's own place
  ///
  /// In vi, this message translates to:
  /// **'Gần tôi'**
  String get areaNearby;

  /// Under near me
  ///
  /// In vi, this message translates to:
  /// **'Cho phép định vị để thấy quán gần bạn'**
  String get areaNearbyHint;

  /// Shows the dishes of the chosen area
  ///
  /// In vi, this message translates to:
  /// **'Xem món'**
  String get areaApply;

  /// While the phone's place is read
  ///
  /// In vi, this message translates to:
  /// **'Đang tìm vị trí của bạn…'**
  String get areaLocating;

  /// Location is refused for the app; the web's words, for a phone
  ///
  /// In vi, this message translates to:
  /// **'Ứng dụng chưa được phép định vị. Bật lại trong Cài đặt của máy, hoặc xem món ở tất cả quán.'**
  String get areaDenied;

  /// The phone could not find its place
  ///
  /// In vi, this message translates to:
  /// **'Chưa tìm được vị trí của bạn. Thử lại sau, hoặc xem món ở tất cả quán.'**
  String get areaFailed;

  /// The search, read by a screen reader while it loads
  ///
  /// In vi, this message translates to:
  /// **'Tìm món'**
  String get searchTitle;

  /// The search field, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Tìm món hoặc quán'**
  String get searchLabel;

  /// Hint in the search field
  ///
  /// In vi, this message translates to:
  /// **'Tìm món, quán'**
  String get searchPlaceholder;

  /// The search's back arrow
  ///
  /// In vi, this message translates to:
  /// **'Về trang chủ'**
  String get searchBack;

  /// Clears the search field
  ///
  /// In vi, this message translates to:
  /// **'Xoá chữ đã gõ'**
  String get searchClear;

  /// Heading of the recent searches
  ///
  /// In vi, this message translates to:
  /// **'Tìm gần đây'**
  String get searchRecent;

  /// Forgets every recent search
  ///
  /// In vi, this message translates to:
  /// **'Xoá'**
  String get searchClearRecent;

  /// Forgets one recent search
  ///
  /// In vi, this message translates to:
  /// **'Xoá “{words}” khỏi tìm gần đây'**
  String searchForget(String words);

  /// Name of the row of chips
  ///
  /// In vi, this message translates to:
  /// **'Bộ lọc'**
  String get searchFilters;

  /// The distance chip
  ///
  /// In vi, this message translates to:
  /// **'Khoảng cách'**
  String get searchDistance;

  /// No distance filter
  ///
  /// In vi, this message translates to:
  /// **'Mọi khoảng cách'**
  String get searchAnyDistance;

  /// A distance choice
  ///
  /// In vi, this message translates to:
  /// **'Trong {distance}'**
  String searchWithin(String distance);

  /// The price chip
  ///
  /// In vi, this message translates to:
  /// **'Giá'**
  String get searchPrice;

  /// The collection time chip
  ///
  /// In vi, this message translates to:
  /// **'Giờ nhận'**
  String get searchWhen;

  /// What can be collected now
  ///
  /// In vi, this message translates to:
  /// **'Nhận ngay'**
  String get searchNow;

  /// The kind chip
  ///
  /// In vi, this message translates to:
  /// **'Loại món'**
  String get searchKind;

  /// No kind filter
  ///
  /// In vi, this message translates to:
  /// **'Mọi loại'**
  String get searchAnyKind;

  /// An order of the results, by the API's name for it
  ///
  /// In vi, this message translates to:
  /// **'{sort, select, relevance{Phù hợp nhất} distance{Gần nhất} ending_soon{Sắp hết giờ} price{Giá thấp nhất} discount{Giảm nhiều nhất} other{Phù hợp nhất}}'**
  String searchSort(String sort);

  /// The order chip
  ///
  /// In vi, this message translates to:
  /// **'Sắp xếp'**
  String get searchSortBy;

  /// How many dishes match the words
  ///
  /// In vi, this message translates to:
  /// **'{count} món cho “{q}”'**
  String searchDishesFor(int count, String q);

  /// How many dishes are on sale, near a place or at every shop
  ///
  /// In vi, this message translates to:
  /// **'{count} món đang bán{place, select, near{ quanh đây} other{}}'**
  String searchDishesHere(int count, String place);

  /// Nothing matches the search
  ///
  /// In vi, this message translates to:
  /// **'Không tìm thấy món nào khớp.'**
  String get searchNothing;

  /// Opens the search without filters
  ///
  /// In vi, this message translates to:
  /// **'Xem tất cả món'**
  String get searchEverything;

  /// Drops every chip, keeping the words
  ///
  /// In vi, this message translates to:
  /// **'Đặt lại bộ lọc'**
  String get searchResetFilters;

  /// The start of a range
  ///
  /// In vi, this message translates to:
  /// **'Từ'**
  String get searchFrom;

  /// The end of a range
  ///
  /// In vi, this message translates to:
  /// **'Đến'**
  String get searchTo;

  /// A range chosen
  ///
  /// In vi, this message translates to:
  /// **'{from}–{to}'**
  String searchRange(String from, String to);

  /// A range with a start only
  ///
  /// In vi, this message translates to:
  /// **'Từ {from}'**
  String searchRangeFrom(String from);

  /// A range with an end only
  ///
  /// In vi, this message translates to:
  /// **'Đến {to}'**
  String searchRangeTo(String to);

  /// A price range out of order
  ///
  /// In vi, this message translates to:
  /// **'Giá “từ” cần thấp hơn giá “đến”.'**
  String get searchPriceOrder;

  /// A time range out of order
  ///
  /// In vi, this message translates to:
  /// **'Giờ “từ” cần sớm hơn giờ “đến”.'**
  String get searchTimeOrder;

  /// Applies a range
  ///
  /// In vi, this message translates to:
  /// **'Áp dụng'**
  String get searchApply;

  /// Drops a range
  ///
  /// In vi, this message translates to:
  /// **'Bỏ lọc'**
  String get searchClearFilter;

  /// Name of a range's quick choices
  ///
  /// In vi, this message translates to:
  /// **'Chọn nhanh'**
  String get searchQuick;

  /// No time at that end
  ///
  /// In vi, this message translates to:
  /// **'Bất kỳ'**
  String get searchAnyTime;

  /// Hint for the lowest price
  ///
  /// In vi, this message translates to:
  /// **'Thấp nhất'**
  String get searchLowest;

  /// Hint for the highest price
  ///
  /// In vi, this message translates to:
  /// **'Cao nhất'**
  String get searchHighest;

  /// Heading of the popular kinds
  ///
  /// In vi, this message translates to:
  /// **'Món phổ biến'**
  String get searchPopular;

  /// How many dishes of a kind are on sale
  ///
  /// In vi, this message translates to:
  /// **'{count} món đang giảm'**
  String searchOnSale(int count);

  /// Shows the results as a grid
  ///
  /// In vi, this message translates to:
  /// **'Xem dạng ô'**
  String get searchViewGrid;

  /// Shows the results as a list by store
  ///
  /// In vi, this message translates to:
  /// **'Xem dạng danh sách'**
  String get searchViewList;

  /// Opens a store from the list
  ///
  /// In vi, this message translates to:
  /// **'Xem quán'**
  String get searchViewSeller;

  /// Opens a store from the list, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Xem quán {seller}'**
  String searchViewSellerNamed(String seller);

  /// Title of the saved stores
  ///
  /// In vi, this message translates to:
  /// **'Yêu thích'**
  String get favouritesTitle;

  /// Above the followed stores
  ///
  /// In vi, this message translates to:
  /// **'Quán bạn theo dõi'**
  String get favouritesIntro;

  /// The heart that follows a store, read by a screen reader
  ///
  /// In vi, this message translates to:
  /// **'Yêu thích {name}'**
  String favouritesFollow(String name);

  /// A store was followed
  ///
  /// In vi, this message translates to:
  /// **'Đã thêm vào Yêu thích'**
  String get favouritesAdded;

  /// A store was let go
  ///
  /// In vi, this message translates to:
  /// **'Đã bỏ khỏi Yêu thích'**
  String get favouritesRemoved;

  /// Following or letting go failed
  ///
  /// In vi, this message translates to:
  /// **'Chưa lưu được, thử lại sau.'**
  String get favouritesFailed;

  /// A followed store with no dish tonight
  ///
  /// In vi, this message translates to:
  /// **'Tối nay chưa có món giảm'**
  String get favouritesNoneTonight;

  /// No store followed yet
  ///
  /// In vi, this message translates to:
  /// **'Chưa có quán yêu thích'**
  String get favouritesEmptyTitle;

  /// How to follow a store
  ///
  /// In vi, this message translates to:
  /// **'Bấm ♡ ở trang quán để theo dõi.'**
  String get favouritesEmptyBody;

  /// Opens the home from the empty saved stores
  ///
  /// In vi, this message translates to:
  /// **'Khám phá quán'**
  String get favouritesExplore;
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
