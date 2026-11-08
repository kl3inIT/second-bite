import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/l10n/gen/app_localizations.dart';

void main() {
  group('English counts', () {
    final en = lookupAppLocalizations(const Locale('en'));

    test('read one portion in the singular', () {
      expect(en.cartSummary(1, '20.000đ'), '1 portion · save 20.000đ');
      expect(en.cartDishes(1), 'Dishes (1 portion)');
      expect(
        en.cartTotalSummary(1, 1, '20.000đ'),
        '1 portion in all · save 20.000đ',
      );
      expect(en.orderOrdered(1), 'Ordered · 1 portion');
      expect(
        en.orderTimelineConfirmedBody('22:39', 1),
        '22:39 · 1 portion kept for you',
      );
      expect(en.dishPerOrder(1), 'At most 1 portion per order');
      expect(en.cartRestUnits(1), 'the 1 portion left');
    });

    test('read more portions in the plural', () {
      expect(en.cartDishes(3), 'Dishes (3 portions)');
      expect(
        en.cartTotalSummary(2, 3, '20.000đ'),
        '2 orders · 3 portions · save 20.000đ',
      );
      expect(en.orderOrdered(3), 'Ordered · 3 portions');
    });
  });
}
