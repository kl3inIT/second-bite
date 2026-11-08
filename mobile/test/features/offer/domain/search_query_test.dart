import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';

void main() {
  group('readSearchQuery', () {
    test('reads each parameter the web writes', () {
      final query = readSearchQuery(
        near: true,
        q: '  bánh mì ',
        kind: 'bakery',
        radiusKm: '2',
        minPrice: '20000',
        maxPrice: '40000',
        from: '21:00',
        to: '22:00',
        sort: 'price',
      );

      expect(query.q, 'bánh mì');
      expect(query.kind, Kind.bakery);
      expect(query.radiusKm, 2);
      expect(query.minPrice, 20000);
      expect(query.maxPrice, 40000);
      expect(query.from, '21:00');
      expect(query.to, '22:00');
      expect(query.sort, Sort3.price);
      expect(query.filtered, isTrue);
    });

    test('drops what it does not understand', () {
      final query = readSearchQuery(
        near: true,
        q: '   ',
        kind: 'pizza',
        radiusKm: '3',
        minPrice: '-1',
        from: '25:00',
        sort: 'cheapest',
      );

      expect(query, const SearchQuery());
      expect(query.filtered, isFalse);
    });

    test('drops a range out of order and keeps one end alone', () {
      expect(
        readSearchQuery(near: false, minPrice: '40000', maxPrice: '20000'),
        const SearchQuery(),
      );
      expect(
        readSearchQuery(near: false, from: '22:00', to: '21:00'),
        const SearchQuery(),
      );
      expect(readSearchQuery(near: false, maxPrice: '20000').maxPrice, 20000);
    });

    test('keeps a radius only around a place', () {
      expect(readSearchQuery(near: false, radiusKm: '1').radiusKm, isNull);
      expect(readSearchQuery(near: true, radiusKm: '1').radiusKm, 1);
    });

    test('lets a range of times replace collecting now', () {
      expect(readSearchQuery(near: false, now: '1').now, isTrue);
      expect(
        readSearchQuery(near: false, now: '1', from: '21:00').now,
        isFalse,
      );
    });
  });

  group('naturalSort', () {
    test('is the best match with words, the nearest around a place, and '
        'closing soon otherwise', () {
      expect(
        const SearchQuery(q: 'gà').naturalSort(near: true),
        Sort3.relevance,
      );
      expect(const SearchQuery().naturalSort(near: true), Sort3.distance);
      expect(const SearchQuery().naturalSort(near: false), Sort3.endingSoon);
    });
  });

  group('tonightAt', () {
    test("returns today's date in Vietnam at the time", () {
      // 23:30 in Vietnam on 19 October is 16:30 UTC.
      final now = DateTime.utc(2026, 10, 19, 16, 30);

      expect(tonightAt('21:00', now: now), DateTime.utc(2026, 10, 19, 14));
    });

    test("takes Vietnam's date after midnight UTC", () {
      // 06:00 in Vietnam on 20 October is 23:00 UTC on the 19th.
      final now = DateTime.utc(2026, 10, 19, 23);

      expect(tonightAt('20:30', now: now), DateTime.utc(2026, 10, 20, 13, 30));
    });

    test('returns null without a time', () {
      expect(tonightAt(null), isNull);
    });
  });
}
