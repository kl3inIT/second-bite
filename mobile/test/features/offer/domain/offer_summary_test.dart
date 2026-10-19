import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

import '../../../helpers/helpers.dart';

void main() {
  group('readHomeQuery', () {
    test('reads words, a known kind and the collect-now switch', () {
      expect(readHomeQuery(q: ' bánh mì ', kind: 'bakery', now: '1'), (
        q: 'bánh mì',
        kind: Kind.bakery,
        now: true,
      ));
    });

    test('drops an unknown kind and empty words', () {
      expect(readHomeQuery(q: '  ', kind: 'pizza', now: 'yes'), everyOffer);
    });
  });

  group('closingFirst', () {
    test('keeps what can be ordered, the earliest end first', () {
      final late = sampleOffer(id: 'late');
      final early = sampleOffer(
        id: 'early',
        until: '2026-10-19T21:30:00+07:00',
      );
      final soldOut = sampleOffer(id: 'gone', unitsLeft: 0);

      expect(closingFirst([late, soldOut, early]), [early, late]);
    });
  });

  group('biggestDiscountFirst', () {
    test('keeps what can be ordered, the biggest discount first', () {
      final small = sampleOffer(id: 'small', discountPercent: 20);
      final big = sampleOffer(id: 'big', discountPercent: 60);

      expect(biggestDiscountFirst([small, big]), [big, small]);
    });
  });

  group('inShowingOrder', () {
    test('puts sold-out offers last', () {
      final soldOut = sampleOffer(id: 'gone', unitsLeft: 0);
      final open = sampleOffer(id: 'open');

      expect(inShowingOrder([soldOut, open]), [open, soldOut]);
    });
  });

  group('openBags', () {
    test('adds the units left and finds the last window', () {
      final bags = openBags([
        sampleOffer(id: 'a', unitsLeft: 2),
        sampleOffer(id: 'b', unitsLeft: 5, until: '2026-10-19T22:15:00+07:00'),
        sampleOffer(id: 'c', unitsLeft: 0),
      ]);

      expect(bags?.bags, 7);
      expect(bags?.lastWindowEnd, DateTime.parse('2026-10-19T22:15:00+07:00'));
    });

    test('returns null when nothing can be ordered', () {
      expect(openBags([sampleOffer(unitsLeft: 0)]), isNull);
    });
  });
}
