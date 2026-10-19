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
  String get homeTitle => 'Tối nay ở Tasco Mall';

  @override
  String get homePlace => 'Tasco Mall';

  @override
  String get homeArea => 'Long Biên, Hà Nội';

  @override
  String get homeSearchLabel => 'Tìm món hoặc quán';

  @override
  String get homeSearchPlaceholder => 'Tìm bánh, gỏi cuốn, rau củ…';

  @override
  String get homeKindsLabel => 'Loại món';

  @override
  String get homeCollectNow => 'Lấy ngay';

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
    return 'Lấy $from';
  }

  @override
  String homeOpenBags(int bags, String last) {
    return '$bags túi đang mở · túi cuối lúc $last';
  }

  @override
  String get homeClosingSoon => 'Sắp hết giờ lấy';

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
    return 'Lấy $from–$until';
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
      'other': 'Khác',
    });
    return '$_temp0';
  }

  @override
  String get introTitle => 'Second Bite là gì?';

  @override
  String get introBody =>
      'Món ngon còn lại cuối ngày của các quán ở Tasco Mall, giá thấp hơn. Bạn đặt trước rồi đến quầy lấy trong khung giờ của món.';

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
  String get navSoon => '(sắp có)';

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
  String get signInEmailInvalid =>
      'Nhập một địa chỉ email, ví dụ ten@gmail.com.';

  @override
  String get signInCodeLimit =>
      'Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại.';

  @override
  String get signInCodeIncorrect =>
      'Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.';

  @override
  String get signInCodeGone =>
      'Mã này đã hết hạn hoặc đã dùng. Gửi lại mã mới.';

  @override
  String get signInGoogleUnverified =>
      'Google chưa xác nhận email này. Đăng nhập bằng mã gửi qua email.';

  @override
  String get signInFailed => 'Chưa đăng nhập được. Vui lòng thử lại.';

  @override
  String signInFailedWithReference(String reference) {
    return 'Chưa đăng nhập được. Vui lòng thử lại. Mã tham chiếu: $reference';
  }

  @override
  String get signInNotArrived => 'Chưa thấy email? Xem trong thư rác (Spam).';
}
