import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppPrice, () {
    group('renders', () {
      for (final size in AppPriceSize.values) {
        testWidgets('both prices when ${size.name}', (tester) async {
          await tester.pumpApp(
            AppPrice(
              price: '39.000đ',
              originalPrice: '95.000đ',
              originalPriceLabel: 'Giá gốc 95.000đ',
              size: size,
            ),
          );

          expect(find.text('39.000đ'), findsOneWidget);
          expect(find.text('95.000đ'), findsOneWidget);
        });
      }

      testWidgets('the new price, then the old one in words', (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(
          const AppPrice(
            price: '39.000đ',
            originalPrice: '95.000đ',
            originalPriceLabel: 'Giá gốc 95.000đ',
          ),
        );

        expect(
          find.bySemanticsLabel('39.000đ\nGiá gốc 95.000đ'),
          findsOneWidget,
        );
        semantics.dispose();
      });
    });
  });
}
