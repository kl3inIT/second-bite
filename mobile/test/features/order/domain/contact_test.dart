import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/order/domain/contact.dart';

// The web's contact.test.ts, case for case, so the two keep one rule.

void main() {
  group('normalizedPhone', () {
    test('takes out spaces, dots and dashes and writes +84 as 0', () {
      expect(normalizedPhone(' 0900 000.00-0 '), '0900000000');
      expect(normalizedPhone('+84 900 000 000'), '0900000000');
    });
  });

  group('the contact', () {
    test('accepts a name and a Vietnamese number in its usual spellings', () {
      expect(nameInvalid('Minh Anh'), isFalse);
      expect(phoneInvalid('+84 900 000 000'), isFalse);
    });

    test('names each field that is wrong', () {
      expect(nameInvalid('  '), isTrue);
      expect(nameInvalid('a' * 51), isTrue);
      expect(nameInvalid('ă' * 50), isFalse);
      expect(phoneInvalid('12345'), isTrue);
      expect(phoneInvalid('1900000000'), isTrue);
    });
  });

  group('groupedPhone', () {
    test('groups a stored number four, three, three', () {
      expect(groupedPhone('0900000000'), '0900 000 000');
    });
  });
}
