import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppSellerAvatar, () {
    group('initialsOf', () {
      test('takes the first letters of the first and last words', () {
        expect(AppSellerAvatar.initialsOf('Lò Bánh Mây'), 'LM');
      });

      test('takes one letter of a one-word name', () {
        expect(AppSellerAvatar.initialsOf(' quầy '), 'Q');
      });

      test('returns nothing for a blank name', () {
        expect(AppSellerAvatar.initialsOf('  '), '');
      });
    });

    group('toneOf', () {
      test("picks the web's colour for a seller's id", () {
        // The web's avatarTone in features/offers/seller.ts gives these.
        expect(AppSellerAvatar.toneOf('se-bakery', 4), 3);
        expect(AppSellerAvatar.toneOf('se-rice', 4), 0);
      });
    });

    group('renders', () {
      testWidgets('two initials at medium size', (tester) async {
        await tester.pumpApp(
          const AppSellerAvatar(name: 'Tiệm bánh Pháp', seed: 'se-bakery'),
        );

        expect(find.text('TP'), findsOneWidget);
      });

      testWidgets('one initial at small size', (tester) async {
        await tester.pumpApp(
          const AppSellerAvatar(
            name: 'Tiệm bánh Pháp',
            seed: 'se-bakery',
            size: AppSellerAvatarSize.small,
          ),
        );

        expect(find.text('T'), findsOneWidget);
      });

      testWidgets('nothing for a screen reader', (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(
          const AppSellerAvatar(name: 'Tiệm bánh Pháp', seed: 'se-bakery'),
        );

        expect(find.bySemanticsLabel('TP'), findsNothing);
        semantics.dispose();
      });
    });
  });
}
