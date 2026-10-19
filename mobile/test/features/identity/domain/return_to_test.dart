import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/identity/domain/return_to.dart';

void main() {
  group('readReturnTo', () {
    test('keeps a path of the app with its query', () {
      expect(readReturnTo('/?q=banh&now=1'), '/?q=banh&now=1');
      expect(readReturnTo('/account'), '/account');
    });

    test('goes home without one', () {
      expect(readReturnTo(null), '/');
      expect(readReturnTo(''), '/');
    });

    for (final value in [
      'https://example.com/',
      '//example.com/',
      r'/\example.com',
      'account',
      'javascript:alert(1)',
    ]) {
      test('goes home instead of $value', () {
        expect(readReturnTo(value), '/');
      });
    }
  });
}
