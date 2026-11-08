// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Vietnamese (`vi`).
class AppLocalizationsVi extends AppLocalizations {
  AppLocalizationsVi([String locale = 'vi']) : super(locale);

  @override
  String get appTitle => 'Second Bite';

  @override
  String get homeArea => 'Hà Nội';

  @override
  String get homeSearchLabel => 'Tìm món hoặc quán';

  @override
  String get homeSearchPlaceholder => 'Tìm bánh, gà rán, pizza…';

  @override
  String get homeKindsLabel => 'Loại món';

  @override
  String get homeCollectNow => 'Nhận ngay';

  @override
  String get homeDealsTitle => 'Túi ngon tối nay ở Tasco Mall';

  @override
  String get homeUpTo => 'Giảm đến';

  @override
  String homeUpToPercent(int percent) {
    return '$percent%';
  }

  @override
  String homeTicketWindow(String from) {
    return 'Nhận $from';
  }

  @override
  String homeOpenBags(int bags, String last) {
    return '$bags túi đang mở · túi cuối lúc $last';
  }

  @override
  String get homeClosingSoon => 'Sắp hết giờ nhận';

  @override
  String get homeSeeAll => 'Xem tất cả';

  @override
  String get homeAllOffers => 'Quanh bạn ở Tasco Mall';

  @override
  String get homeResults => 'Kết quả';

  @override
  String get homeEmpty => 'Tối nay chưa có món nào.';

  @override
  String get homeEmptyFiltered => 'Không có món nào khớp bộ lọc này.';

  @override
  String get homeShowAll => 'Xem tất cả món';

  @override
  String get homeLoading => 'Đang tải món…';

  @override
  String offerStock(int units) {
    return 'Còn $units';
  }

  @override
  String get offerSoldOut => 'Đã hết';

  @override
  String offerWindow(String from, String until) {
    return 'Nhận $from–$until';
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
    return 'Giảm $percent%';
  }

  @override
  String offerOriginalPrice(String price) {
    return 'Giá gốc $price';
  }

  @override
  String offerKind(String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'bakery': 'Bánh',
      'prepared_food': 'Món chín',
      'ingredients': 'Nguyên liệu',
      'drinks': 'Đồ uống',
      'mixed_box': 'Hộp tổng hợp',
      'dessert': 'Tráng miệng',
      'snacks': 'Ăn vặt',
      'produce': 'Rau củ quả',
      'other': 'Khác',
    });
    return '$_temp0';
  }

  @override
  String get introTitle => 'Second Bite là gì?';

  @override
  String get introBody =>
      'Món ngon còn lại cuối ngày của các quán ở Tasco Mall, giá thấp hơn. Bạn đặt trước rồi đến quầy nhận trong khung giờ của món.';

  @override
  String get introDismiss => 'Đóng giới thiệu';

  @override
  String get languageSwitch => 'Switch to English';

  @override
  String get errorTitle => 'Đã có lỗi xảy ra';

  @override
  String get errorOffline =>
      'Không kết nối được. Vui lòng kiểm tra mạng rồi thử lại.';

  @override
  String get errorBody =>
      'Vui lòng thử lại. Nếu vẫn lỗi, hãy báo cho chúng tôi mã bên dưới.';

  @override
  String errorReference(String reference) {
    return 'Mã tham chiếu: $reference';
  }

  @override
  String get errorRetry => 'Thử lại';

  @override
  String get navLabel => 'Điều hướng chính';

  @override
  String get navHome => 'Trang chủ';

  @override
  String get navOrders => 'Đơn của tôi';

  @override
  String get navSaved => 'Yêu thích';

  @override
  String get navAccount => 'Tài khoản';

  @override
  String get accountTitle => 'Tài khoản';

  @override
  String get accountGuestTitle => 'Bạn chưa đăng nhập';

  @override
  String get accountGuestBody => 'Đăng nhập để đặt món và theo dõi đơn.';

  @override
  String get legalLabel => 'Thông tin pháp lý';

  @override
  String get legalTerms => 'Điều khoản sử dụng';

  @override
  String get legalPrivacy => 'Chính sách quyền riêng tư';

  @override
  String get legalDraft =>
      'Bản nháp, đang chờ người sáng lập và luật sư xem xét. Nội dung có thể thay đổi trước khi Second Bite mở cho mọi người; những chỗ ghi “đang cập nhật” sẽ được bổ sung.';

  @override
  String legalUpdated(DateTime date) {
    final intl.DateFormat dateDateFormat = intl.DateFormat.yMMMMd(localeName);
    final String dateString = dateDateFormat.format(date);

    return 'Cập nhật lần cuối: $dateString';
  }

  @override
  String get legalContents => 'Các mục';

  @override
  String get legalTermsIntro =>
      'Điều khoản này là thỏa thuận giữa bạn và Second Bite khi bạn dùng trang web và ứng dụng Second Bite, với tư cách khách hàng hay người bán.';

  @override
  String get legalTermsSection1Title => '1. Second Bite là gì';

  @override
  String get legalTermsSection1Body =>
      'Second Bite là nền tảng phi lợi nhuận kết nối các quán còn món dư cuối ngày với khách muốn mua với giá thấp hơn. Second Bite không lấy hoa hồng trên doanh thu của quán.\n\nĐơn vị vận hành: đang cập nhật (tên, địa chỉ, mã số và giấy phép nếu có).\n\nMua bán món diễn ra giữa khách và quán. Second Bite cung cấp nơi đăng, tìm và đặt món; Second Bite không bán món và không kiểm tra món.';

  @override
  String get legalTermsSection2Title => '2. Tài khoản';

  @override
  String get legalTermsSection2Body =>
      'Bạn xem, tìm và đặt món mà không cần tài khoản; khi đặt, bạn cho quán tên và số điện thoại của người đến lấy. Bạn cần đăng nhập để theo dõi quán hoặc đăng món cho một quán.\n\nHãy giữ an toàn hộp thư và tài khoản Google bạn dùng để đăng nhập, và không đăng nhập thay người khác.';

  @override
  String get legalTermsSection3Title => '3. Trách nhiệm của người bán';

  @override
  String get legalTermsSection3Body =>
      'Chỉ đăng món thật sự còn dư, không phải món vẫn cần cho việc bán hàng bình thường.\n\nMô tả trung thực món, số lượng, giá gốc và giá bán; giá bán phải thấp hơn giá gốc ít nhất mức giảm tối thiểu do Second Bite quy định (hiện là 20%).\n\nChịu trách nhiệm về chất lượng, an toàn thực phẩm và thông tin về chất gây dị ứng của món, và kiểm tra món khi giao cho khách.\n\nẢnh và nội dung bạn đăng phải là của bạn hoặc bạn được phép dùng; bạn cho phép Second Bite hiển thị chúng trên nền tảng.';

  @override
  String get legalTermsSection4Title => '4. Trách nhiệm của khách';

  @override
  String get legalTermsSection4Body =>
      'Đến lấy món trong khung giờ của món; đơn không đến lấy có thể bị ghi nhận và ảnh hưởng tới việc đặt món về sau.\n\nĐọc kỹ mô tả món, đặc biệt là thông tin về chất gây dị ứng, và hỏi quán khi chưa rõ. Món dư có thể khác chút ít so với ảnh.\n\nMỗi người được đặt một số lượng món giới hạn mỗi ngày, để món dư đến được với nhiều người.';

  @override
  String get legalTermsSection5Title => '5. Giá, thanh toán và hủy đơn';

  @override
  String get legalTermsSection5Body =>
      'Giá hiển thị là giá của quán; phí của bên thứ ba, nếu có, được ghi riêng trước khi bạn đặt.\n\nỞ giai đoạn thử nghiệm, bạn thanh toán trực tiếp cho quán khi đến lấy món. Hủy đơn và hoàn tiền: đang cập nhật, sẽ có khi tính năng đặt món mở.';

  @override
  String get legalTermsSection6Title => '6. Hành vi không được phép';

  @override
  String get legalTermsSection6Body =>
      'Đăng nội dung sai sự thật, vi phạm pháp luật hoặc của người khác; đặt món mà không có ý định lấy; can thiệp vào hệ thống hoặc dùng tài khoản của người khác.\n\nSecond Bite có thể ẩn món, tạm khóa quán hoặc tài khoản vi phạm điều khoản này.';

  @override
  String get legalTermsSection7Title => '7. Giới hạn trách nhiệm';

  @override
  String get legalTermsSection7Body =>
      'Second Bite cố gắng giữ dịch vụ hoạt động ổn định nhưng không bảo đảm dịch vụ luôn sẵn sàng. Trong phạm vi pháp luật cho phép, Second Bite không chịu trách nhiệm về chất lượng món do quán bán; khiếu nại về món được gửi tới quán, và Second Bite hỗ trợ hai bên giải quyết.';

  @override
  String get legalTermsSection8Title =>
      '8. Thay đổi điều khoản và luật áp dụng';

  @override
  String get legalTermsSection8Body =>
      'Khi điều khoản thay đổi, chúng tôi cập nhật ngày ở đầu trang và báo trước nếu thay đổi ảnh hưởng tới quyền của bạn.\n\nĐiều khoản này theo pháp luật Việt Nam. Tranh chấp được giải quyết bằng thương lượng trước, sau đó theo quy định của pháp luật.\n\nLiên hệ: đang cập nhật.';

  @override
  String get legalPrivacyIntro =>
      'Second Bite là nền tảng phi lợi nhuận giúp các quán bán món còn dư cuối ngày với giá thấp hơn. Trang này cho biết chúng tôi thu dữ liệu cá nhân nào, để làm gì, lưu bao lâu, ai được xem, và bạn có những quyền gì, theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 52/2013/NĐ-CP.';

  @override
  String get legalPrivacySection1Title =>
      '1. Ai chịu trách nhiệm về dữ liệu của bạn';

  @override
  String get legalPrivacySection1Body =>
      'Bên kiểm soát dữ liệu cá nhân: đang cập nhật (tên tổ chức hoặc cá nhân, địa chỉ).\n\nLiên hệ về quyền riêng tư: đang cập nhật.';

  @override
  String get legalPrivacySection2Title =>
      '2. Dữ liệu chúng tôi thu và để làm gì';

  @override
  String get legalPrivacySection2Body =>
      'Xem món và tìm kiếm không cần tài khoản. Khi bạn tìm món quanh một vị trí, vị trí đó chỉ được dùng để tính khoảng cách trong lần tìm ấy và không được lưu.\n\nTài khoản: địa chỉ email của bạn, để gửi mã đăng nhập và nhận ra bạn ở lần sau; tên hiển thị, để quán gọi bạn khi giao món.\n\nĐăng nhập bằng Google (sắp có): mã định danh Google của bạn, địa chỉ email, tên và ảnh đại diện mà Google chia sẻ khi bạn đồng ý, để đăng nhập và hiển thị tên của bạn.\n\nPhiên đăng nhập: một mã ngẫu nhiên giữ bạn đăng nhập; chúng tôi chỉ lưu bản băm của nó cùng thời điểm dùng gần nhất.\n\nNgười bán: tên quán, địa chỉ, vị trí trên bản đồ, số điện thoại của quán và email của chủ quán, nhân viên, để quán đăng món và khách tìm đến lấy.\n\nẢnh: ảnh món và ảnh quán do người bán tải lên. Ảnh được ghi lại ở hai kích thước và bỏ toàn bộ thông tin đi kèm như vị trí chụp hay loại máy.\n\nĐơn hàng (sắp có): món, số lượng, giờ lấy, trạng thái đơn, để quán chuẩn bị món và giới hạn số món mỗi người được đặt trong ngày.\n\nEmail đã gửi: người nhận, loại email và mã của nhà cung cấp, để biết email có tới được không.\n\nNhật ký kỹ thuật: thời điểm, đường dẫn và kết quả của từng yêu cầu, để tìm và sửa lỗi; nhật ký không ghi email, mã đăng nhập hay mật khẩu.';

  @override
  String get legalPrivacySection3Title => '3. Lưu bao lâu';

  @override
  String get legalPrivacySection3Body =>
      'Mã đăng nhập: xóa khi dùng xong, khi bạn xin mã mới, hoặc muộn nhất một ngày sau khi gửi.\n\nPhiên đăng nhập: hết hạn sau 30 ngày không dùng; xóa khi bạn đăng xuất.\n\nẢnh tải lên nhưng không dùng cho món hay quán nào: xóa sau một ngày.\n\nTài khoản, quán, món đã đăng và đơn hàng: giữ cho tới khi bạn xóa tài khoản hoặc yêu cầu xóa, trừ phần pháp luật buộc phải giữ lâu hơn.\n\nKhi bạn xóa tài khoản: tài khoản, phiên đăng nhập, liên kết Google, mã đăng nhập và bản ghi các email gửi cho bạn bị xóa ngay; tư cách thành viên ở các quán và ảnh chưa dùng bị xóa trong vài phút sau đó. Món đã đăng, ảnh món và ảnh quán thuộc về quán nên được giữ, không còn gắn với bạn; quán bạn là chủ sẽ bị đóng. Đơn hàng của bạn: tên, số điện thoại và đồng ý nhận tin qua Zalo bị xóa khỏi đơn, cùng cuộc trò chuyện với quán; quán giữ lại số đơn, món, số tiền và trạng thái để đối soát, không còn gắn với bạn.';

  @override
  String get legalPrivacySection4Title => '4. Ai được xem dữ liệu của bạn';

  @override
  String get legalPrivacySection4Body =>
      'Người bán thấy tên hiển thị và đơn hàng của bạn với quán của họ; không thấy email của bạn. Khách thấy thông tin công khai của quán và món.\n\nQuản trị viên của Second Bite xem dữ liệu khi cần để vận hành và hỗ trợ.\n\nCác bên xử lý dữ liệu thay chúng tôi: nhà cung cấp máy chủ (Amazon Web Services; nơi đặt máy chủ: đang cập nhật), nhà cung cấp dịch vụ email (Brevo), và Google khi bạn chọn đăng nhập bằng Google. Nếu dữ liệu được lưu ở nước ngoài, chúng tôi sẽ nêu rõ tại đây.\n\nChúng tôi không bán dữ liệu của bạn và không dùng nó để quảng cáo.';

  @override
  String get legalPrivacySection5Title => '5. Quyền của bạn';

  @override
  String get legalPrivacySection5Body =>
      'Bạn có quyền được biết, xem, sửa và yêu cầu xóa dữ liệu của mình; rút lại sự đồng ý; yêu cầu hạn chế xử lý; và khiếu nại, theo Luật Bảo vệ dữ liệu cá nhân 2025.\n\nBạn tự xóa được tài khoản trong ứng dụng (Tài khoản → Cài đặt tài khoản → Xóa tài khoản) hoặc trên trang web tại /delete-account, sau khi nhập mã chúng tôi gửi đến email của tài khoản.\n\nBạn tự sửa được tên hiển thị trong tài khoản. Với các yêu cầu khác, hãy gửi cho chúng tôi qua địa chỉ liên hệ ở mục 1; chúng tôi trả lời trong thời hạn pháp luật quy định, và nếu không thể xóa vì lý do chính đáng, chúng tôi sẽ cho bạn biết lý do.';

  @override
  String get legalPrivacySection6Title =>
      '6. Cookie và lưu trữ trên trình duyệt';

  @override
  String get legalPrivacySection6Body =>
      'Cookie phiên đăng nhập (sắp có), để giữ bạn đăng nhập.\n\nCookie ngôn ngữ, nhớ bạn chọn tiếng Việt hay tiếng Anh trong một năm.\n\nCookie nơi xem món, nhớ khu bạn đã chọn (một điểm làm tròn khoảng 100 m và tên khu) trong 180 ngày; chọn “Tất cả quán” để xoá.\n\nMột dấu trong bộ nhớ trình duyệt, nhớ bạn đã đóng phần giới thiệu.\n\nChúng tôi không dùng cookie quảng cáo hay công cụ theo dõi của bên thứ ba.';

  @override
  String get legalPrivacySection7Title => '7. Bảo vệ dữ liệu';

  @override
  String get legalPrivacySection7Body =>
      'Kết nối được mã hóa; mã đăng nhập và phiên đăng nhập chỉ được lưu dưới dạng băm; quyền truy cập được kiểm tra ở máy chủ cho từng yêu cầu. Nếu xảy ra sự cố lộ dữ liệu, chúng tôi sẽ thông báo theo quy định của pháp luật.';

  @override
  String get legalPrivacySection8Title => '8. Trẻ em';

  @override
  String get legalPrivacySection8Body =>
      'Second Bite dành cho người từ 16 tuổi. Nếu bạn dưới 16 tuổi, hãy dùng cùng cha mẹ hoặc người giám hộ.';

  @override
  String get legalPrivacySection9Title => '9. Thay đổi chính sách';

  @override
  String get legalPrivacySection9Body =>
      'Khi chính sách thay đổi, chúng tôi cập nhật ngày ở đầu trang và báo cho bạn trước khi thay đổi có hiệu lực nếu nó ảnh hưởng tới quyền của bạn.';

  @override
  String get notFoundTitle => 'Không tìm thấy trang này';

  @override
  String get notFoundBack => 'Về trang chủ';

  @override
  String get topBarBack => 'Quay lại';

  @override
  String get accountSignIn => 'Đăng nhập';

  @override
  String accountMenu(String email) {
    return 'Tài khoản $email';
  }

  @override
  String accountSignedInAs(String email) {
    return 'Đã đăng nhập: $email';
  }

  @override
  String get accountSignOut => 'Đăng xuất';

  @override
  String get accountSignedIn => 'Đã đăng nhập';

  @override
  String get signInTitle => 'Đăng nhập';

  @override
  String get signInHeading => 'Đăng nhập để đặt món';

  @override
  String get signInOr => 'hoặc dùng email';

  @override
  String get signInGoogle => 'Tiếp tục với Google';

  @override
  String get signInEmailLabel => 'Email';

  @override
  String get signInEmailPlaceholder => 'ten@gmail.com';

  @override
  String get signInSendCode => 'Gửi mã';

  @override
  String get signInSendCodeHere => 'Gửi mã đến email này';

  @override
  String get signInSending => 'Đang gửi mã…';

  @override
  String signInLegal(String terms, String privacy) {
    return 'Khi tiếp tục, bạn đồng ý với $terms và $privacy.';
  }

  @override
  String get signInCodeHeading => 'Kiểm tra email của bạn';

  @override
  String signInCodeSent(String email) {
    return 'Mã đăng nhập 6 số đã gửi đến $email.';
  }

  @override
  String get signInChangeEmail => 'Đổi email';

  @override
  String get signInCodeLabel => 'Mã đăng nhập 6 số';

  @override
  String get signInConfirm => 'Xác nhận';

  @override
  String get signInConfirming => 'Đang xác nhận…';

  @override
  String signInResendIn(String time) {
    return 'Gửi lại mã sau $time';
  }

  @override
  String get signInResend => 'Gửi lại mã';

  @override
  String get signInGoogleNeedsCodeTitle => 'Email này đã có tài khoản';

  @override
  String signInGoogleNeedsCodeBody(String email) {
    return '$email đã có tài khoản Second Bite. Nhận mã qua email này để đăng nhập.';
  }

  @override
  String get signInGoogleNeedsCodeBodyNoAddress =>
      'Email của tài khoản Google này đã có tài khoản Second Bite. Nhận mã qua email để đăng nhập.';

  @override
  String get signInFailed => 'Chưa đăng nhập được. Vui lòng thử lại.';

  @override
  String get signInNotArrived => 'Chưa thấy email? Xem trong thư rác (Spam).';

  @override
  String get deleteAccountTitle => 'Xoá tài khoản';

  @override
  String get deleteAccountIntro =>
      'Bạn có thể xoá tài khoản Second Bite bất cứ lúc nào, trong ứng dụng hoặc tại trang này. Việc xoá là vĩnh viễn và không thể hoàn tác.';

  @override
  String get deleteAccountDeletedTitle => 'Bị xoá ngay khi bạn xác nhận';

  @override
  String get deleteAccountDeleted1 =>
      'Tài khoản của bạn: địa chỉ email và tên hiển thị.';

  @override
  String get deleteAccountDeleted2 =>
      'Mọi phiên đăng nhập trên mọi thiết bị, và liên kết với tài khoản Google.';

  @override
  String get deleteAccountDeleted3 =>
      'Mã đăng nhập và bản ghi các email chúng tôi đã gửi cho bạn.';

  @override
  String get deleteAccountLaterTitle => 'Bị xoá trong vài phút sau đó';

  @override
  String get deleteAccountLater1 =>
      'Tư cách chủ quán hoặc nhân viên của bạn ở các quán.';

  @override
  String get deleteAccountLater2 =>
      'Ảnh bạn đã tải lên nhưng chưa dùng cho món hay quán nào.';

  @override
  String get deleteAccountKeptTitle => 'Được giữ lại, không còn gắn với bạn';

  @override
  String get deleteAccountKept1 =>
      'Món đã đăng, ảnh món và ảnh quán: chúng thuộc về quán.';

  @override
  String get deleteAccountKept2 =>
      'Đơn hàng: số đơn, món, số tiền và trạng thái, để quán đối soát; tên, số điện thoại và đồng ý nhận tin qua Zalo trên đơn bị xoá, cùng cuộc trò chuyện với quán.';

  @override
  String get deleteAccountOwnerTitle => 'Bạn đang là chủ quán';

  @override
  String deleteAccountOwnerBody(String sellers) {
    return 'Xoá tài khoản sẽ đóng $sellers: quán ngừng hiển thị với khách và nhân viên không quản lý được nữa, cho tới khi Second Bite xử lý.';
  }

  @override
  String get deleteAccountSignedOutTitle => 'Đăng nhập để xoá tài khoản';

  @override
  String get deleteAccountSignedOutBody =>
      'Để chắc người xoá là chủ tài khoản, bạn đăng nhập rồi nhập mã chúng tôi gửi đến email của tài khoản.';

  @override
  String get deleteAccountSendCode => 'Gửi mã xác nhận';

  @override
  String get deleteAccountSending => 'Đang gửi mã…';

  @override
  String deleteAccountConfirmBody(String email) {
    return 'Chúng tôi sẽ gửi mã 6 số đến $email để xác nhận bạn muốn xoá tài khoản.';
  }

  @override
  String get deleteAccountFinal =>
      'Khi bạn nhập đúng mã, tài khoản bị xoá ngay và không thể hoàn tác.';

  @override
  String get deleteAccountOwnedFailed =>
      'Chưa đọc được các quán của bạn, nên chưa biết quán nào sẽ đóng cùng tài khoản. Thử lại trước khi gửi mã.';

  @override
  String get deleteAccountRetry => 'Thử lại';

  @override
  String get deleteAccountCodeHeading => 'Nhập mã xác nhận';

  @override
  String deleteAccountCodeSent(String email) {
    return 'Mã 6 số đã gửi đến $email. Mã chỉ dùng để xoá tài khoản.';
  }

  @override
  String get deleteAccountCodeLabel => 'Mã xác nhận 6 số';

  @override
  String get deleteAccountConfirm => 'Xoá vĩnh viễn tài khoản';

  @override
  String get deleteAccountDeleting => 'Đang xoá…';

  @override
  String get deleteAccountCancel => 'Giữ tài khoản';

  @override
  String get deleteAccountFailed =>
      'Chưa xoá được tài khoản. Vui lòng thử lại.';

  @override
  String get deleteAccountDoneTitle => 'Đã xoá tài khoản';

  @override
  String get deleteAccountDoneBody =>
      'Tài khoản và dữ liệu cá nhân của bạn đã được xoá. Bạn vẫn có thể đăng nhập lại bằng email này bất cứ lúc nào, như một tài khoản mới.';

  @override
  String get deleteAccountHome => 'Về trang chủ';

  @override
  String get accountSettingsTitle => 'Cài đặt tài khoản';

  @override
  String get accountSettingsDetails => 'Thông tin tài khoản';

  @override
  String get accountSettingsEmail => 'Email';

  @override
  String get accountSettingsDisplayName => 'Tên hiển thị';

  @override
  String get accountSettingsNoDisplayName => 'Chưa có';

  @override
  String get accountSettingsSellers => 'Quán của bạn';

  @override
  String get accountSettingsOwner => 'Chủ quán';

  @override
  String get accountSettingsStaff => 'Nhân viên';

  @override
  String get accountSettingsLanguage => 'Ngôn ngữ';

  @override
  String get accountSettingsLanguageName => 'Tiếng Việt';

  @override
  String get accountSettingsDeleteTitle => 'Xoá tài khoản';

  @override
  String get accountSettingsDeleteBody =>
      'Xoá vĩnh viễn tài khoản và dữ liệu cá nhân của bạn. Việc xoá không thể hoàn tác; quán bạn là chủ sẽ bị đóng.';

  @override
  String get accountSettingsDeleteAction => 'Xoá tài khoản';

  @override
  String problemReference(String reference) {
    return 'Mã tham chiếu: $reference';
  }

  @override
  String get accountSettingsEditName => 'Sửa tên hiển thị';

  @override
  String get accountSettingsSave => 'Lưu';

  @override
  String get accountSettingsSaving => 'Đang lưu…';

  @override
  String get accountSettingsCancel => 'Huỷ';

  @override
  String get accountSettingsNameFailed =>
      'Chưa lưu được tên. Thử lại sau ít phút.';

  @override
  String sellerWindow(String from, String until) {
    return 'Nhận hôm nay $from–$until';
  }

  @override
  String get sellerDirections => 'Chỉ đường ›';

  @override
  String get sellerKinds => 'Loại món';

  @override
  String get sellerOnSale => 'Đang giảm';

  @override
  String get sellerTonight => 'Đang giảm tối nay';

  @override
  String get sellerNothing => 'Quán chưa có món tối nay';

  @override
  String get sellerHome => 'Xem món khác';

  @override
  String sellerNoMatch(String q) {
    return 'Không có món nào khớp “$q”';
  }

  @override
  String get sellerShare => 'Chia sẻ quán';

  @override
  String sellerSearch(String seller) {
    return 'Tìm trong thực đơn $seller';
  }

  @override
  String get dishAbout => 'Về món này';

  @override
  String dishWeight(int grams) {
    return 'Khoảng $grams g.';
  }

  @override
  String get dishNotes => 'Lưu ý';

  @override
  String get dishBringBag => 'Nên mang túi hoặc hộp riêng.';

  @override
  String get dishAskSeller => 'Hỏi quán về thành phần và dị ứng.';

  @override
  String get dishSellerAnswers =>
      'Second Bite chỉ kết nối bạn với quán; quán chịu trách nhiệm về chất lượng và vệ sinh an toàn thực phẩm của món.';

  @override
  String get dishTerms => 'Điều khoản';

  @override
  String dishCount(int count, String name) {
    return '$count phần $name sẽ thêm';
  }

  @override
  String dishAdd(String price) {
    return 'Thêm vào giỏ · $price';
  }

  @override
  String dishAllChosen(int units) {
    return 'Đã chọn đủ $units phần';
  }

  @override
  String cartAdd(String name) {
    return 'Thêm một phần $name';
  }

  @override
  String cartRemove(String name) {
    return 'Bớt một phần $name';
  }

  @override
  String cartQuantity(int quantity, String name) {
    return '$quantity phần $name trong giỏ';
  }

  @override
  String cartSummary(int units, String saved) {
    return '$units phần · tiết kiệm $saved';
  }

  @override
  String cartPortionsLeft(int units) {
    return 'còn $units phần';
  }

  @override
  String cartPortionsChosen(int units) {
    return 'đã chọn đủ $units phần';
  }

  @override
  String cartPortionsCapped(int units) {
    return 'tối đa $units phần mỗi đơn';
  }

  @override
  String dishCapChosen(int units) {
    return 'Đã chọn tối đa $units phần mỗi đơn';
  }

  @override
  String dishPerOrder(int units) {
    return 'Tối đa $units phần mỗi đơn';
  }

  @override
  String get cartTitle => 'Xác nhận đơn';

  @override
  String get cartClose => 'Đóng';

  @override
  String get cartOpen => 'Xem giỏ hàng';

  @override
  String get cartEmpty => 'Giỏ hàng đang trống';

  @override
  String get cartBrowse => 'Xem món tối nay';

  @override
  String get cartDirections => 'Chỉ đường';

  @override
  String cartSellerWindow(String place, String from, String until) {
    return '$place · Nhận $from – $until';
  }

  @override
  String get cartOver => 'Hết giờ nhận';

  @override
  String cartDropLabel(String name) {
    return 'Bỏ $name khỏi giỏ';
  }

  @override
  String get cartPay => 'Thanh toán';

  @override
  String get cartCounter => 'Thanh toán tại quầy';

  @override
  String get cartTransfer => 'Chuyển khoản';

  @override
  String get cartSoon => '(sắp có)';

  @override
  String cartSummaryTitle(int orders) {
    String _temp0 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: 'Tổng cộng · $orders đơn',
      one: 'Tổng cộng',
    );
    return '$_temp0';
  }

  @override
  String cartDishes(int units) {
    return 'Tiền món ($units phần)';
  }

  @override
  String get cartTotal => 'Tổng tiền';

  @override
  String get cartCancelTitle => 'Chính sách huỷ';

  @override
  String get cartCancelBody => 'Huỷ được cho tới khi quán báo món sẵn sàng.';

  @override
  String cartTotalSummary(int orders, int units, String saved) {
    String _temp0 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: '$orders đơn · $units phần',
      one: 'Tổng $units phần',
    );
    return '$_temp0 · tiết kiệm $saved';
  }

  @override
  String cartOrder(int orders) {
    String _temp0 = intl.Intl.pluralLogic(
      orders,
      locale: localeName,
      other: 'Đặt $orders đơn',
      one: 'Đặt món',
    );
    return '$_temp0';
  }

  @override
  String get cartContactTitle => 'Người đến nhận';

  @override
  String get cartContactHint =>
      'Quán gọi tên này khi bạn đến và gọi số này nếu cần.';

  @override
  String get cartNameLabel => 'Tên';

  @override
  String get cartPhoneLabel => 'Số điện thoại';

  @override
  String get cartNameInvalid => 'Nhập tên từ 1 đến 50 ký tự.';

  @override
  String get cartPhoneInvalid => 'Nhập số điện thoại 10 số, bắt đầu bằng 0.';

  @override
  String get cartContactSubmit => 'Tiếp tục';

  @override
  String get cartConfirmTitle => 'Xác nhận đặt đơn với số điện thoại';

  @override
  String get cartConfirmYes => 'Đúng, đặt món';

  @override
  String get cartConfirmEdit => 'Sửa';

  @override
  String cartGoneOne(String name) {
    return '$name vừa hết';
  }

  @override
  String cartGoneMany(int count) {
    return '$count món vừa hết';
  }

  @override
  String get cartGoneBody =>
      'Người khác vừa đặt phần cuối. Bạn chưa bị tính tiền.';

  @override
  String cartFewerOne(String name, int left) {
    return '$name chỉ còn $left phần';
  }

  @override
  String cartFewerMany(int count) {
    return '$count món còn ít phần hơn bạn chọn';
  }

  @override
  String get cartFewerBody =>
      'Người khác vừa đặt trước bạn. Bạn chưa bị tính tiền.';

  @override
  String cartOrderRest(String what, String price) {
    return 'Đặt $what · $price';
  }

  @override
  String cartLine(int quantity, String name) {
    return '$quantity× $name';
  }

  @override
  String cartRestUnits(int units) {
    return '$units phần còn lại';
  }

  @override
  String get cartOtherDishes => 'Xem món khác của quán';

  @override
  String get cartOrderFailedPlain =>
      'Chưa đặt được món. Kiểm tra mạng rồi thử lại.';

  @override
  String cartPromotionRule(String rule, String amount) {
    return '$rule: giảm $amount';
  }

  @override
  String cartPromotionRuleFrom(String rule, String amount, String from) {
    return '$rule: giảm $amount cho đơn từ $from';
  }

  @override
  String cartPromotionPercent(int value, String max) {
    return '$value% (tối đa $max)';
  }

  @override
  String cartPromotionPerDay(int count) {
    return 'Mỗi số điện thoại được giảm $count lần mỗi ngày.';
  }

  @override
  String get cartPromotionAfter =>
      'Số tiền giảm hiện trên đơn ngay sau khi đặt; bạn trả ít hơn tại quầy.';

  @override
  String get ordersTitle => 'Đơn của tôi';

  @override
  String get ordersLists => 'Danh sách đơn';

  @override
  String ordersTabOpen(int count) {
    return 'Đang chờ nhận ($count)';
  }

  @override
  String get ordersTabEnded => 'Đã xong';

  @override
  String get ordersNoneOpen => 'Bạn chưa có đơn nào đang chờ nhận.';

  @override
  String get ordersNoneEnded => 'Chưa có đơn nào đã xong.';

  @override
  String ordersReadyUntil(String until) {
    return 'Sẵn sàng · đến $until';
  }

  @override
  String get ordersPreparing => 'Đang chuẩn bị';

  @override
  String ordersCardMetaWindow(
    String number,
    String total,
    String from,
    String until,
  ) {
    return '#$number · $total · nhận $from–$until';
  }

  @override
  String ordersCardMetaReady(String number, String total) {
    return '#$number · $total · trả khi nhận';
  }

  @override
  String get ordersSeeQr => 'Xem mã QR nhận món';

  @override
  String get ordersSeeOrder => 'Xem đơn';

  @override
  String get ordersDayToday => 'Hôm nay';

  @override
  String get ordersDayWeek => 'Tuần này';

  @override
  String get ordersDayBefore => 'Trước đó';

  @override
  String ordersDate(int day, int month) {
    return '$day/$month';
  }

  @override
  String get ordersEndedLineConfirmed => 'Đã xác nhận';

  @override
  String get ordersEndedLineReady => 'Sẵn sàng';

  @override
  String get ordersEndedLineCollected => 'Đã nhận';

  @override
  String get ordersEndedLineCancelled => 'Đã huỷ · không thu tiền';

  @override
  String get ordersEndedLineRefused => 'Quán không giao · không thu tiền';

  @override
  String get ordersEndedLineExpired => 'Hết hạn, không đến nhận';

  @override
  String get ordersSignInTitle => 'Chưa thấy đơn nào';

  @override
  String get ordersSignInBody =>
      'Chưa có đơn nào đặt trên ứng dụng này. Nếu bạn đặt khi đã đăng nhập, đăng nhập để xem.';

  @override
  String orderNumber(String number) {
    return 'Đơn #$number';
  }

  @override
  String get orderHeadlineConfirmed => 'Đã xác nhận · quán đang chuẩn bị';

  @override
  String get orderHeadlineReady => 'Món đã sẵn sàng';

  @override
  String orderOpensIn(String left) {
    return 'Nhận hôm nay · mở sau $left';
  }

  @override
  String orderClosesIn(String left) {
    return 'Nhận hôm nay · còn $left';
  }

  @override
  String orderHoursMinutes(int hours, int minutes) {
    return '$hours giờ $minutes phút';
  }

  @override
  String orderMinutes(int minutes) {
    return '$minutes phút';
  }

  @override
  String orderCounterToday(String address, String from, String until) {
    return '$address · $from–$until hôm nay';
  }

  @override
  String orderUnits(int units) {
    return '$units phần';
  }

  @override
  String get orderCollectReady =>
      'Đưa mã QR cho quầy quét hoặc đọc tên, số điện thoại để nhận món.';

  @override
  String get orderCollectLater =>
      'Mã QR hiện khi món sẵn sàng. Có thể đọc tên, số điện thoại để nhận món.';

  @override
  String orderQrLabel(String number) {
    return 'Mã QR nhận đơn #$number';
  }

  @override
  String orderPlacedWith(String seller) {
    return 'Cùng lần đặt: $seller';
  }

  @override
  String get orderHowTitle => 'Cách nhận món';

  @override
  String get orderHowGoTitle => 'Đến quầy thu ngân';

  @override
  String get orderHowQrTitle => 'Đưa mã QR';

  @override
  String get orderHowQrBody => 'hoặc đọc tên, số ĐT';

  @override
  String get orderHowTakeTitle => 'Nhận món';

  @override
  String get orderHowTakeBody => 'Nhớ mang túi riêng';

  @override
  String get orderStepsLabel => 'Các bước của đơn';

  @override
  String get orderStepPlaced => 'Đã đặt';

  @override
  String get orderStepPreparing => 'Chuẩn bị';

  @override
  String get orderStepReady => 'Sẵn sàng';

  @override
  String get orderStepCollected => 'Hoàn tất';

  @override
  String orderOrdered(int units) {
    return 'Món đã đặt · $units phần';
  }

  @override
  String get orderOriginalPrice => 'Giá gốc';

  @override
  String get orderFactSaved => 'Tiết kiệm';

  @override
  String orderFactSavedValue(String saved) {
    return '$saved so với giá gốc';
  }

  @override
  String get orderFactTotal => 'Tổng';

  @override
  String get orderFactPayAtCounter => 'Trả tại quầy';

  @override
  String get orderFactBeforeDiscount => 'Giá trước khi giảm';

  @override
  String get orderFactNumber => 'Mã đơn';

  @override
  String get orderFactPayment => 'Thanh toán';

  @override
  String get orderFactAtCounter => 'Thanh toán tại quầy';

  @override
  String get orderFactNothing => 'Không thu tiền';

  @override
  String orderFactDiscount(String promotion, String rule) {
    return '$promotion · $rule';
  }

  @override
  String get orderDirectionsLabel => 'Đường đến quầy';

  @override
  String orderPlaceLine(String seller, String address) {
    return '$seller · $address';
  }

  @override
  String get orderDirections => 'Chỉ đường';

  @override
  String get orderSeeOthers => 'Xem món khác';

  @override
  String orderCollectedAt(String time) {
    return 'Đã nhận món lúc $time';
  }

  @override
  String orderSavedLine(int units) {
    return 'Tiết kiệm so với giá gốc · $units phần không bị bỏ phí';
  }

  @override
  String orderEndedAtCollected(String time, String date) {
    return 'Đã nhận món lúc $time · $date';
  }

  @override
  String get orderEndedBadgeCancelled => 'Đơn đã huỷ';

  @override
  String get orderEndedBadgeRefused => 'Quán không giao đơn này';

  @override
  String get orderEndedBadgeExpired => 'Đơn đã hết hạn';

  @override
  String get orderTimelineTitle => 'Trạng thái';

  @override
  String get orderTimelinePlaced => 'Bạn đã đặt đơn';

  @override
  String orderTimelinePlacedBody(
    String date,
    String time,
    int units,
    String total,
  ) {
    return '$date, $time · $units phần · $total';
  }

  @override
  String get orderTimelineConfirmed => 'Quán xác nhận đơn';

  @override
  String orderTimelineConfirmedBody(String time, int units) {
    return '$time · giữ $units phần cho bạn';
  }

  @override
  String get orderTimelineCancelled => 'Bạn đã huỷ đơn';

  @override
  String orderTimelineWithReason(String time, String reason) {
    return '$time · $reason';
  }

  @override
  String orderTimelineReturned(int units) {
    return '$units phần đã trả lại cho quán';
  }

  @override
  String get orderTimelineReturnedBody => 'Người khác có thể đặt';

  @override
  String get orderTimelineReady => 'Món đã sẵn sàng';

  @override
  String orderTimelineReadyBody(String time) {
    return '$time · quán báo bạn đến nhận';
  }

  @override
  String orderTimelineToldBody(String date, String time) {
    return '$date, $time · đã báo cho bạn';
  }

  @override
  String get orderTimelineCollected => 'Bạn đã nhận món';

  @override
  String orderTimelineCollectedBody(String time, String total) {
    return '$time · đã trả $total';
  }

  @override
  String orderTimelineCollectedRated(String time, String total, int stars) {
    return '$time · đã trả $total · bạn chấm $stars sao';
  }

  @override
  String get orderTimelineRefused => 'Quán từ chối giao';

  @override
  String orderTimelineRefusedBody(String time, String reason) {
    return '$time · lý do: $reason';
  }

  @override
  String get orderTimelineExpired => 'Hết giờ nhận';

  @override
  String orderTimelineExpiredBody(String until) {
    return '$until · đơn ghi là không nhận';
  }

  @override
  String get orderTimelineSummaryCancelled =>
      'Bạn chưa trả tiền nên không có gì phải hoàn.';

  @override
  String orderTimelineSummaryRefused(String reason) {
    return 'Quán không giao được đơn: $reason. Bạn không phải trả tiền.';
  }

  @override
  String orderTimelineSummaryExpired(String until) {
    return 'Không ai đến nhận trước $until. Lần sau nếu không kịp, hãy huỷ đơn để món đến được người khác.';
  }

  @override
  String get orderRefuseReasonNotSuitable => 'món không còn phù hợp';

  @override
  String get orderRefuseReasonWrongItems => 'món không đúng với đơn';

  @override
  String get orderRefuseReasonNoAnswer => 'quán không gọi được cho bạn';

  @override
  String get orderRefuseReasonNoShow => 'bạn chưa đến nhận';

  @override
  String get orderRefuseReasonLate => 'đã quá giờ nhận';

  @override
  String get orderRefuseReasonSoldOut => 'món đã hết';

  @override
  String get orderRefuseReasonOther => 'lý do khác';

  @override
  String get orderRefuseReasonWithdrawn => 'quán đã rút bài này';

  @override
  String get orderCancelOpen => 'Huỷ đơn';

  @override
  String orderCancelTitle(String number) {
    return 'Huỷ đơn #$number?';
  }

  @override
  String orderCancelBody(int units, String seller) {
    return '$units phần sẽ trả lại cho $seller để người khác đặt.';
  }

  @override
  String get orderCancelReason => 'Lý do huỷ (không bắt buộc)';

  @override
  String get orderCancelReasonLate => 'Không đến kịp';

  @override
  String get orderCancelReasonMistake => 'Đặt nhầm';

  @override
  String get orderCancelReasonOther => 'Lý do khác';

  @override
  String get orderCancelKeep => 'Giữ đơn';

  @override
  String get orderCancelConfirm => 'Huỷ đơn';

  @override
  String get orderCancelFailed => 'Chưa huỷ được đơn. Thử lại sau ít phút.';

  @override
  String get reviewTitle => 'Món hôm nay thế nào?';

  @override
  String get reviewHint => 'Đánh giá giúp quán và người mua sau.';

  @override
  String get reviewStarsLegend => 'Số sao';

  @override
  String reviewStar(int count) {
    return '$count sao';
  }

  @override
  String get reviewWord1 => 'Tệ';

  @override
  String get reviewWord2 => 'Chưa ổn';

  @override
  String get reviewWord3 => 'Bình thường';

  @override
  String get reviewWord4 => 'Tốt';

  @override
  String get reviewWord5 => 'Tuyệt vời';

  @override
  String get reviewTagsTitle => 'Điều gì làm bạn hài lòng?';

  @override
  String get reviewTagFastPickup => 'Nhận hàng nhanh';

  @override
  String get reviewTagGoodQuality => 'Chất lượng tốt';

  @override
  String get reviewTagGoodVariety => 'Đa dạng món';

  @override
  String get reviewTagFairPortions => 'Đủ số lượng';

  @override
  String get reviewComment => 'Viết vài dòng cho quán (không bắt buộc)';

  @override
  String get reviewSubmit => 'Gửi đánh giá';

  @override
  String get reviewFailed => 'Chưa gửi được đánh giá. Thử lại sau ít phút.';

  @override
  String get reviewGiven => 'Bạn đã đánh giá';

  @override
  String get reviewThanks => 'Cảm ơn bạn, quán sẽ đọc đánh giá này.';

  @override
  String get reviewErrorStars => 'Chọn số sao cho đơn.';

  @override
  String get orderProblemOpen => 'Báo vấn đề với đơn';

  @override
  String orderProblemTitle(String number) {
    return 'Đơn #$number có vấn đề gì?';
  }

  @override
  String get orderProblemBody =>
      'Chọn điều chưa ổn. Chúng tôi chuyển cho quán và trả lời bạn.';

  @override
  String get orderProblemKindLegend => 'Điều chưa ổn';

  @override
  String get orderProblemKindMissingItem => 'Thiếu món';

  @override
  String get orderProblemKindWrongItem => 'Sai món';

  @override
  String get orderProblemKindPoorQuality => 'Món không đạt';

  @override
  String get orderProblemKindStoreClosed => 'Quán đóng cửa khi đến';

  @override
  String get orderProblemNote => 'Ghi thêm (không bắt buộc)';

  @override
  String get orderProblemNotePlaceholder => 'Ví dụ: thiếu 1 bánh mì chà bông';

  @override
  String get orderProblemSend => 'Gửi cho quán';

  @override
  String get orderProblemLater => 'Để sau';

  @override
  String get orderProblemFailed => 'Chưa gửi được. Thử lại sau ít phút.';

  @override
  String get orderProblemErrorKind => 'Chọn điều chưa ổn với đơn.';

  @override
  String get orderProblemReportedTitle => 'Vấn đề bạn đã báo';

  @override
  String orderProblemNoteAt(String time, String note) {
    return '$time · $note';
  }

  @override
  String orderProblemSent(String seller) {
    return 'Đã gửi cho $seller';
  }

  @override
  String get orderProblemWaiting => 'Quán sẽ trả lời bạn ở đây';

  @override
  String orderProblemAnswered(String seller, String time) {
    return '$seller trả lời · $time';
  }

  @override
  String chatUnread(int count) {
    return '$count tin nhắn chưa đọc';
  }

  @override
  String get chatMessageStore => 'Nhắn quán';

  @override
  String get chatViewMessages => 'Xem tin nhắn';

  @override
  String get chatStoreWrote => 'Quán vừa nhắn';

  @override
  String chatQuote(String text) {
    return '“$text”';
  }

  @override
  String get chatSeeMessage => 'Xem tin';

  @override
  String chatCardMeta(int units, String from, String until) {
    return '$units phần · $from–$until hôm nay';
  }

  @override
  String chatConfirmedToday(String number) {
    return 'Hôm nay · Đơn #$number đã xác nhận';
  }

  @override
  String chatConfirmedOn(String date, String number) {
    return '$date · Đơn #$number đã xác nhận';
  }

  @override
  String get chatLog => 'Tin nhắn của đơn';

  @override
  String get chatMine => 'Bạn';

  @override
  String chatSeen(String time) {
    return '$time · Đã xem';
  }

  @override
  String get chatNote =>
      'Tin nhắn không đổi giá, số lượng hay giờ nhận của đơn.';

  @override
  String get chatPlaceholderToStore => 'Nhắn cho quán…';

  @override
  String get chatSend => 'Gửi tin nhắn';

  @override
  String get chatRetry => 'Gửi lại';

  @override
  String get chatFailed => 'Chưa gửi được';

  @override
  String get chatQuickReplies => 'Trả lời nhanh';

  @override
  String get chatReplyComing => 'Mình đang tới';

  @override
  String get chatReplyLate => 'Cho mình nhận trễ 10 phút';

  @override
  String get chatReplyStillHave => 'Quán còn món không?';

  @override
  String get chatLocked => 'Đơn đã kết thúc, chỉ xem lại tin nhắn.';

  @override
  String get homePlaceAll => 'Tất cả quán';

  @override
  String get homePlaceNearby => 'Vị trí của tôi';

  @override
  String get homeHeadingAll => 'Tối nay: Tất cả quán';

  @override
  String homeHeadingAround(String place) {
    return 'Tối nay quanh $place';
  }

  @override
  String get homeAreaPlace => 'Các quán quanh đây';

  @override
  String get homeAreaNearby => 'Các quán gần bạn';

  @override
  String get homeFilters => 'Lọc món';

  @override
  String get areaOpen => 'Chọn nơi xem món';

  @override
  String get areaTitle => 'Xem món ở đâu?';

  @override
  String get areaClose => 'Đóng';

  @override
  String get areaField => 'Tìm nơi xem món';

  @override
  String get areaFieldPlaceholder => 'Gõ địa chỉ, tên khu…';

  @override
  String get areaClear => 'Xoá chữ đã gõ';

  @override
  String areaSuggestions(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count nơi gợi ý',
      zero: 'Không có nơi nào',
    );
    return '$_temp0';
  }

  @override
  String get areaNoPlace =>
      'Không tìm thấy nơi này. Thử tên phường, đường hoặc toà nhà khác, hoặc dùng vị trí của bạn.';

  @override
  String get areaAreas => 'Khu vực';

  @override
  String get areaAll => 'Tất cả quán';

  @override
  String get areaAllHint => 'Mặc định · món sắp hết giờ lên trước';

  @override
  String get areaMall => 'Tasco Mall Long Biên';

  @override
  String get areaMallHint => 'Gợi ý · các quán trong trung tâm';

  @override
  String get areaNearby => 'Gần tôi';

  @override
  String get areaNearbyHint => 'Cho phép định vị để thấy quán gần bạn';

  @override
  String get areaApply => 'Xem món';

  @override
  String get areaLocating => 'Đang tìm vị trí của bạn…';

  @override
  String get areaDenied =>
      'Ứng dụng chưa được phép định vị. Bật lại trong Cài đặt của máy, hoặc xem món ở tất cả quán.';

  @override
  String get areaFailed =>
      'Chưa tìm được vị trí của bạn. Thử lại sau, hoặc xem món ở tất cả quán.';

  @override
  String get searchTitle => 'Tìm món';

  @override
  String get searchLabel => 'Tìm món hoặc quán';

  @override
  String get searchPlaceholder => 'Tìm món, quán';

  @override
  String get searchBack => 'Về trang chủ';

  @override
  String get searchClear => 'Xoá chữ đã gõ';

  @override
  String get searchRecent => 'Tìm gần đây';

  @override
  String get searchClearRecent => 'Xoá';

  @override
  String searchForget(String words) {
    return 'Xoá “$words” khỏi tìm gần đây';
  }

  @override
  String get searchFilters => 'Bộ lọc';

  @override
  String get searchDistance => 'Khoảng cách';

  @override
  String get searchAnyDistance => 'Mọi khoảng cách';

  @override
  String searchWithin(String distance) {
    return 'Trong $distance';
  }

  @override
  String get searchPrice => 'Giá';

  @override
  String get searchWhen => 'Giờ nhận';

  @override
  String get searchNow => 'Nhận ngay';

  @override
  String get searchKind => 'Loại món';

  @override
  String get searchAnyKind => 'Mọi loại';

  @override
  String searchSort(String sort) {
    String _temp0 = intl.Intl.selectLogic(sort, {
      'relevance': 'Phù hợp nhất',
      'distance': 'Gần nhất',
      'ending_soon': 'Sắp hết giờ',
      'price': 'Giá thấp nhất',
      'discount': 'Giảm nhiều nhất',
      'other': 'Phù hợp nhất',
    });
    return '$_temp0';
  }

  @override
  String get searchSortBy => 'Sắp xếp';

  @override
  String searchDishesFor(int count, String q) {
    return '$count món cho “$q”';
  }

  @override
  String searchDishesHere(int count, String place) {
    String _temp0 = intl.Intl.selectLogic(place, {
      'near': ' quanh đây',
      'other': '',
    });
    return '$count món đang bán$_temp0';
  }

  @override
  String get searchNothing => 'Không tìm thấy món nào khớp.';

  @override
  String get searchEverything => 'Xem tất cả món';

  @override
  String get searchResetFilters => 'Đặt lại bộ lọc';

  @override
  String get searchFrom => 'Từ';

  @override
  String get searchTo => 'Đến';

  @override
  String searchRange(String from, String to) {
    return '$from–$to';
  }

  @override
  String searchRangeFrom(String from) {
    return 'Từ $from';
  }

  @override
  String searchRangeTo(String to) {
    return 'Đến $to';
  }

  @override
  String get searchPriceOrder => 'Giá “từ” cần thấp hơn giá “đến”.';

  @override
  String get searchTimeOrder => 'Giờ “từ” cần sớm hơn giờ “đến”.';

  @override
  String get searchApply => 'Áp dụng';

  @override
  String get searchClearFilter => 'Bỏ lọc';

  @override
  String get searchQuick => 'Chọn nhanh';

  @override
  String get searchAnyTime => 'Bất kỳ';

  @override
  String get searchLowest => 'Thấp nhất';

  @override
  String get searchHighest => 'Cao nhất';

  @override
  String get searchPopular => 'Món phổ biến';

  @override
  String searchOnSale(int count) {
    return '$count món đang giảm';
  }

  @override
  String get searchViewGrid => 'Xem dạng ô';

  @override
  String get searchViewList => 'Xem dạng danh sách';

  @override
  String get searchViewSeller => 'Xem quán';

  @override
  String searchViewSellerNamed(String seller) {
    return 'Xem quán $seller';
  }

  @override
  String get favouritesTitle => 'Yêu thích';

  @override
  String get favouritesIntro => 'Quán bạn theo dõi';

  @override
  String favouritesFollow(String name) {
    return 'Yêu thích $name';
  }

  @override
  String get favouritesAdded => 'Đã thêm vào Yêu thích';

  @override
  String get favouritesRemoved => 'Đã bỏ khỏi Yêu thích';

  @override
  String get favouritesFailed => 'Chưa lưu được, thử lại sau.';

  @override
  String get favouritesNoneTonight => 'Tối nay chưa có món giảm';

  @override
  String get favouritesEmptyTitle => 'Chưa có quán yêu thích';

  @override
  String get favouritesEmptyBody => 'Bấm ♡ ở trang quán để theo dõi.';

  @override
  String get favouritesExplore => 'Khám phá quán';
}
