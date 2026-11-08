import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/order/domain/cart.dart';

import '../../../helpers/helpers.dart';

// The web's cart.test.ts, case for case, so the two carts keep one rule.

OfferSummary _offer(
  String id, {
  String sellerId = 's1',
  int unitsLeft = 3,
  ({String start, String end}) window = (start: '21:00', end: '21:45'),
}) {
  final base = sampleOffer(
    id: id,
    name: id,
    sellerId: sellerId,
    sellerName: 'Quán $sellerId',
    unitsLeft: unitsLeft,
    from: '2026-10-20T${window.start}:00+07:00',
    until: '2026-10-20T${window.end}:00+07:00',
  );
  return base.copyWith(
    priceVnd: 20000,
    originalPriceVnd: 50000,
    photo: OfferPhotoBody(
      id: id,
      largePath: '/photos/$id/1600.jpg',
      smallPath: '/photos/$id/400.jpg',
    ),
  );
}

Cart? _cartOf(List<OfferSummary> steps) {
  Cart? cart;
  for (final step in steps) {
    cart = addOne(cart, step);
  }
  return cart;
}

Basket _basketOf(List<OfferSummary> steps) => _cartOf(steps)!.baskets.first;

DateTime _at(String time) => DateTime.parse('2026-10-20T$time:00+07:00');

void main() {
  group('the cart', () {
    test('starts with one portion of the first dish', () {
      final cart = _cartOf([_offer('croissant')]);

      expect(cart?.baskets.map((basket) => basket.seller.id), ['s1']);
      expect(quantityOf(cart, 'croissant'), 1);
    });

    test('never holds more of a dish than its portions left', () {
      final croissant = _offer('croissant', unitsLeft: 2);

      expect(
        quantityOf(_cartOf([croissant, croissant, croissant]), 'croissant'),
        2,
      );
    });

    test("keeps each store's dishes in their own basket, in order", () {
      final cart = _cartOf([
        _offer('croissant'),
        _offer('ha-cao', sellerId: 's2'),
        _offer('eclair'),
      ])!;

      expect(
        [
          for (final basket in cart.baskets)
            [basket.seller.id, basket.lines.map((line) => line.id).toList()],
        ],
        [
          [
            's1',
            ['croissant', 'eclair'],
          ],
          [
            's2',
            ['ha-cao'],
          ],
        ],
      );
      expect(
        withBasket(cart, 's1', null)?.baskets.map((each) => each.seller.id),
        ['s2'],
      );
      expect(withBasket(withBasket(cart, 's1', null)!, 's2', null), isNull);
    });

    test('shows a store as the dish added last has it', () {
      const logo = OfferPhotoBody(
        id: 'logo',
        largePath: '/photos/logo/1600.jpg',
        smallPath: '/photos/logo/400.jpg',
      );
      final eclair = _offer('eclair');
      final later = eclair.copyWith(
        seller: eclair.seller.copyWith(photo: logo),
      );

      expect(_basketOf([_offer('croissant'), later]).seller.photo, logo);
    });

    test(
      "adds several portions from the dish's sheet, never more than left",
      () {
        final croissant = _offer('croissant');
        final cart = addPortions(null, croissant, 2);

        expect(quantityOf(cart, 'croissant'), 2);
        expect(quantityOf(addPortions(cart, croissant, 2), 'croissant'), 3);
        expect(
          cart.baskets.first.lines.first.photo?.smallPath,
          '/photos/croissant/400.jpg',
        );
      },
    );

    test(
      'adds one more of a dish already in the cart, never more than left',
      () {
        final cart = _cartOf([_offer('croissant', unitsLeft: 2)])!;

        expect(quantityOf(oneMore(cart, 'croissant'), 'croissant'), 2);
        expect(
          quantityOf(
            oneMore(oneMore(cart, 'croissant'), 'croissant'),
            'croissant',
          ),
          2,
        );
      },
    );

    test('lets a dish go at none and is gone with its last dish', () {
      final cart = _cartOf([
        _offer('croissant'),
        _offer('croissant'),
        _offer('eclair'),
      ])!;

      expect(quantityOf(removeOne(cart, 'croissant'), 'croissant'), 1);
      expect(
        removeOne(removeOne(cart, 'eclair')!, 'croissant')?.baskets.first.lines,
        hasLength(1),
      );
      expect(removeOne(_cartOf([_offer('eclair')])!, 'eclair'), isNull);
    });

    test("adds up the portions, tonight's price and the price before", () {
      final cart = _cartOf([
        _offer('croissant'),
        _offer('croissant'),
        _offer('eclair', sellerId: 's2'),
      ])!;

      expect(totalsOf(cart.lines), (
        units: 3,
        priceVnd: 60000,
        originalPriceVnd: 150000,
      ));
    });

    test("collects when every dish's window is open, or at the earliest", () {
      final shared = _basketOf([
        _offer('croissant', window: (start: '20:30', end: '21:30')),
        _offer('eclair'),
      ]);
      final apart = _basketOf([
        _offer('croissant', window: (start: '22:00', end: '22:30')),
        _offer('eclair', window: (start: '20:00', end: '20:30')),
      ]);

      expect(collectionWindow(shared), (
        windowStart: _at('21:00'),
        windowEnd: _at('21:30'),
      ));
      expect(collectionWindow(apart).windowStart, _at('20:00'));
    });

    test('reads back only what is a cart, and one basket as a cart', () {
      final cart = _cartOf([_offer('croissant')])!;
      Object? asKept(Object value) => jsonDecode(jsonEncode(value));

      expect(readCart(asKept(cart)), cart);
      expect(readCart(asKept(cart.baskets.first)), cart);
      expect(
        readCart({
          'seller': {'id': 's1'},
          'lines': <Object>[],
        }),
        isNull,
      );
      expect(readCart({'baskets': <Object>[]}), isNull);
      expect(readCart('[]'), isNull);
    });
  });

  group('what is left after someone else ordered first', () {
    test('cuts each dish to its portions left and names the dishes it cut', () {
      final basket = _basketOf([
        _offer('croissant'),
        _offer('croissant'),
        _offer('eclair'),
        _offer('tart'),
      ]);

      final (basket: kept, :cut) = keepLeft(basket, {
        'croissant': 1,
        'eclair': 0,
        'tart': 3,
      });

      expect(
        [for (final each in cut) (each.line.id, each.left)],
        [('croissant', 1), ('eclair', 0)],
      );
      expect(
        [for (final line in kept!.lines) (line.id, line.quantity)],
        [('croissant', 1), ('tart', 1)],
      );
    });

    test('leaves nothing when every dish is gone', () {
      expect(keepLeft(_basketOf([_offer('croissant')]), {}).basket, isNull);
    });
  });

  group('dishes whose window has closed', () {
    final cart = _cartOf([
      _offer('croissant', window: (start: '20:00', end: '20:30')),
      _offer('eclair'),
      _offer('tart', sellerId: 's2', window: (start: '20:00', end: '20:30')),
    ])!;

    test('counts a dish as over from the end of its window', () {
      final croissant = cart.baskets.first.lines.first;

      expect(isOver(croissant, _at('20:29')), isFalse);
      expect(isOver(croissant, _at('20:30')), isTrue);
    });

    test('orders only the dishes still open, dropping a store with none', () {
      final live = orderable(cart, _at('20:45'))!;

      expect(
        [
          for (final basket in live.baskets)
            [basket.seller.id, basket.lines.map((line) => line.id).toList()],
        ],
        [
          [
            's1',
            ['eclair'],
          ],
        ],
      );
      expect(totalsOf(live.lines).units, 1);
      expect(orderable(cart, _at('21:45')), isNull);
    });

    test('takes a dish out with all its portions', () {
      final twice = addOne(cart, _offer('eclair'));

      expect(quantityOf(removeLine(twice, 'eclair'), 'eclair'), 0);
      expect(
        removeLine(removeLine(cart, 'croissant')!, 'eclair')!.baskets,
        hasLength(1),
      );
    });
  });
}
