import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

const window = 'Lấy 21:00–21:45';

AppOfferTile _subject({String stock = 'Còn 3', bool soldOut = false}) {
  return AppOfferTile(
    sellerName: 'Tiệm bánh Pháp',
    sellerSeed: 'se-bakery',
    dishName: 'Túi bánh mì và croissant, 4 chiếc',
    stockLabel: stock,
    windowLabel: window,
    discountLabel: '-58%',
    discountSemanticLabel: 'Giảm 58%',
    price: '39.000đ',
    originalPrice: '95.000đ',
    originalPriceLabel: 'Giá gốc 95.000đ',
    soldOut: soldOut,
  );
}

void main() {
  group(AppOfferTile, () {
    group('renders', () {
      testWidgets('the seller, the dish, the window and the prices', (
        tester,
      ) async {
        await tester.pumpApp(Center(child: _subject()));

        expect(find.text('Tiệm bánh Pháp'), findsOneWidget);
        expect(find.text('Túi bánh mì và croissant, 4 chiếc'), findsOneWidget);
        expect(find.text(window), findsOneWidget);
        expect(find.text('39.000đ'), findsOneWidget);
        expect(find.text('95.000đ'), findsOneWidget);
        expect(find.text('-58%'), findsOneWidget);
      });

      testWidgets('the stock on its sticker', (tester) async {
        await tester.pumpApp(Center(child: _subject()));

        expect(
          find.descendant(
            of: find.byType(AppSticker),
            matching: find.text('Còn 3'),
          ),
          findsOneWidget,
        );
      });

      testWidgets('a sold-out offer in words', (tester) async {
        await tester.pumpApp(
          Center(child: _subject(stock: 'Đã hết', soldOut: true)),
        );

        expect(find.text('Đã hết'), findsOneWidget);
      });

      testWidgets('without overflowing at twice the text size', (tester) async {
        tester.platformDispatcher.textScaleFactorTestValue = 2;
        addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
        await tester.pumpApp(
          SingleChildScrollView(child: SizedBox(width: 200, child: _subject())),
        );

        expect(tester.takeException(), isNull);
      });
    });
  });
}
