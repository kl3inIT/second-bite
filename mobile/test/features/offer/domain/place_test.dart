import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/offer/domain/place.dart';

void main() {
  group('nearOf', () {
    test('rounds a point to three decimals', () {
      expect(nearOf(21.05649, 105.896412), '21.056,105.896');
    });

    test('names Tasco Mall as the web does', () {
      expect(mallNear, '21.056,105.896');
    });
  });

  group('partsOfAddress', () {
    test('splits the first part from the rest', () {
      expect(partsOfAddress('Phố Hoa Lâm, Phường Việt Hưng, Hà Nội'), (
        name: 'Phố Hoa Lâm',
        rest: 'Phường Việt Hưng, Hà Nội',
      ));
    });

    test('leaves the rest empty for one part', () {
      expect(partsOfAddress('Hà Nội'), (name: 'Hà Nội', rest: ''));
    });
  });

  group('readPlace', () {
    test('reads a place written by writePlace', () {
      const place = (near: '21.057,105.896', name: 'Tasco Mall Long Biên');

      expect(readPlace(jsonDecode(writePlace(place))), place);
    });

    test('reads a place without a name', () {
      const place = (near: '21.057,105.896', name: null);

      expect(writePlace(place), '{"near":"21.057,105.896"}');
      expect(readPlace(jsonDecode(writePlace(place))), place);
    });

    test('returns null for a point it does not understand', () {
      expect(readPlace({'near': 'Hà Nội'}), isNull);
      expect(readPlace({'near': 21}), isNull);
      expect(readPlace('21.057,105.896'), isNull);
    });

    test('drops a blank or too long name', () {
      expect(readPlace({'near': '21.057,105.896', 'place': '  '}), (
        near: '21.057,105.896',
        name: null,
      ));
      expect(readPlace({'near': '21.057,105.896', 'place': 'x' * 81}), (
        near: '21.057,105.896',
        name: null,
      ));
    });
  });
}
