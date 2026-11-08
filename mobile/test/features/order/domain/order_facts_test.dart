import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';

import '../../../helpers/helpers.dart';

void main() {
  group('order facts', () {
    group('isOpen', () {
      test('is true for a confirmed or ready order only', () {
        for (final status in OrderBodyStatus.$valuesDefined) {
          expect(
            isOpen(sampleOrder().copyWith(status: status)),
            status == OrderBodyStatus.confirmed ||
                status == OrderBodyStatus.ready,
            reason: '$status',
          );
        }
      });
    });

    group('canCancel', () {
      test('is true until the store marks the order ready', () {
        expect(canCancel(sampleOrder()), isTrue);
        expect(
          canCancel(sampleOrder().copyWith(status: OrderBodyStatus.ready)),
          isFalse,
        );
      });
    });

    group('savingOf', () {
      test('is the original prices less what is paid, discount included', () {
        final order = sampleOrder().copyWith(
          lines: [sampleOrderLine()],
          totalVnd: 30000,
          discountVnd: 10000,
          payVnd: 20000,
        );

        expect(savingOf(order), 78000 - 20000);
      });

      test('is never below zero', () {
        expect(savingOf(sampleOrder().copyWith(payVnd: 1)), 0);
      });
    });

    group('unitsOf and dishesOf', () {
      test('count the portions and join the dishes', () {
        final order = sampleOrder().copyWith(
          lines: [
            sampleOrderLine(),
            sampleOrderLine(name: 'Croissant', units: 1, offerId: 'of-2'),
          ],
        );

        expect(unitsOf(order), 3);
        expect(dishesOf(order), 'Bánh mì bơ tỏi & Croissant');
      });
    });

    group('hoursAndMinutes', () {
      test('rounds up to the minute', () {
        expect(
          hoursAndMinutes(const Duration(hours: 1, minutes: 11, seconds: 1)),
          (hours: 1, minutes: 12),
        );
      });

      test('is never below zero', () {
        expect(hoursAndMinutes(const Duration(minutes: -5)), (
          hours: 0,
          minutes: 0,
        ));
      });
    });

    group('windowPhaseOf', () {
      final order = sampleOrder();

      test('is before, open, then over', () {
        expect(
          windowPhaseOf(order, DateTime.parse('2026-10-19T20:30:00+07:00')),
          WindowPhase.before,
        );
        expect(
          windowPhaseOf(order, DateTime.parse('2026-10-19T21:10:00+07:00')),
          WindowPhase.open,
        );
        expect(
          windowPhaseOf(order, DateTime.parse('2026-10-19T21:45:00+07:00')),
          WindowPhase.over,
        );
      });
    });

    group('dayOf', () {
      final now = DateTime.parse('2026-10-19T00:30:00+07:00');

      test('counts days in Vietnam, not in UTC', () {
        // 23:59 the evening before in Vietnam is the same UTC day as now.
        expect(
          dayOf(DateTime.parse('2026-10-18T23:59:00+07:00'), now),
          OrderDay.week,
        );
        expect(
          dayOf(DateTime.parse('2026-10-19T00:10:00+07:00'), now),
          OrderDay.today,
        );
      });

      test('puts seven days ago and before under earlier', () {
        expect(
          dayOf(DateTime.parse('2026-10-13T20:00:00+07:00'), now),
          OrderDay.week,
        );
        expect(
          dayOf(DateTime.parse('2026-10-12T20:00:00+07:00'), now),
          OrderDay.before,
        );
      });
    });

    group('byCheckout', () {
      test('groups orders placed together, the newest group first', () {
        final first = sampleOrder(
          id: 'a',
        ).copyWith(checkoutId: 'c1', createdAt: DateTime.utc(2026, 10, 19, 12));
        final second = sampleOrder(id: 'b').copyWith(
          checkoutId: 'c1',
          createdAt: DateTime.utc(2026, 10, 19, 12, 0, 1),
        );
        final later = sampleOrder(
          id: 'c',
        ).copyWith(checkoutId: 'c2', createdAt: DateTime.utc(2026, 10, 19, 13));

        expect(
          [
            for (final group in byCheckout([second, later, first]))
              [for (final order in group) order.id],
          ],
          [
            ['c'],
            ['a', 'b'],
          ],
        );
      });
    });

    group('endedAt', () {
      test('is when the order was cancelled or refused, else its end', () {
        final cancelled = DateTime.utc(2026, 10, 19, 13);
        expect(
          endedAt(
            sampleOrder().copyWith(
              status: OrderBodyStatus.cancelled,
              cancelledAt: cancelled,
            ),
          ),
          cancelled,
        );
        expect(
          endedAt(sampleOrder().copyWith(status: OrderBodyStatus.expired)),
          sampleOrder().windowEnd,
        );
      });
    });
  });
}
