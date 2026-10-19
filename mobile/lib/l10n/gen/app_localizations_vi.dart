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
}
