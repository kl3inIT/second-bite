import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppCartBar, () {
    group('renders', () {
      testWidgets('the price over the one before and the summary', (
        tester,
      ) async {
        await tester.pumpApp(
          const AppCartBar(
            price: '78.000đ',
            originalPrice: '190.000đ',
            originalPriceLabel: 'Giá gốc 190.000đ',
            summary: '2 phần · tiết kiệm 112.000đ',
          ),
        );

        expect(find.text('78.000đ'), findsOneWidget);
        expect(find.text('190.000đ'), findsOneWidget);
        expect(find.text('2 phần · tiết kiệm 112.000đ'), findsOneWidget);
      });

      testWidgets('its action', (tester) async {
        await tester.pumpApp(
          AppCartBar(
            price: '78.000đ',
            originalPrice: '190.000đ',
            originalPriceLabel: 'Giá gốc 190.000đ',
            summary: '2 phần · tiết kiệm 112.000đ',
            action: AppButton(onPressed: () {}, child: const Text('Xem giỏ')),
          ),
        );

        expect(find.text('Xem giỏ'), findsOneWidget);
      });

      testWidgets('the price before in words for a screen reader', (
        tester,
      ) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(
          const AppCartBar(
            price: '78.000đ',
            originalPrice: '190.000đ',
            originalPriceLabel: 'Giá gốc 190.000đ',
            summary: '2 phần',
          ),
        );

        expect(find.bySemanticsLabel('Giá gốc 190.000đ'), findsOneWidget);
        semantics.dispose();
      });
    });
  });
}
