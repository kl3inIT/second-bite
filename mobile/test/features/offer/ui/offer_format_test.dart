import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';

void main() {
  group('formatPrice', () {
    test('writes đồng with dots between thousands', () {
      expect(formatPrice(39000), '39.000đ');
      expect(formatPrice(1250000), '1.250.000đ');
    });
  });

  group('formatTime', () {
    test('writes the 24-hour clock in Vietnam whatever the offset', () {
      expect(formatTime(DateTime.parse('2026-10-19T21:05:00+07:00')), '21:05');
      expect(formatTime(DateTime.parse('2026-10-19T14:05:00Z')), '21:05');
    });
  });
}
