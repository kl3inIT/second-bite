import 'package:intl/intl.dart';

// Prices in đồng and times in Vietnam are written one way in both languages,
// as on the web: "39.000đ" and "21:45" (docs/guidelines/mobile.md › Data,
// session and language).
final _dong = NumberFormat.decimalPattern('vi');

/// [amount] in đồng, as "39.000đ".
String formatPrice(int amount) => '${_dong.format(amount)}đ';

/// [moment] on the 24-hour clock in Asia/Ho_Chi_Minh, which keeps UTC+7 all
/// year, whatever the phone's own time zone.
String formatTime(DateTime moment) {
  final vietnam = moment.toUtc().add(const Duration(hours: 7));
  String two(int value) => value.toString().padLeft(2, '0');
  return '${two(vietnam.hour)}:${two(vietnam.minute)}';
}
