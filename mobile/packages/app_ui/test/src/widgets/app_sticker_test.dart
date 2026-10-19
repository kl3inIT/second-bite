import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppSticker, () {
    group('renders', () {
      testWidgets('the stock it is given', (tester) async {
        await tester.pumpApp(const AppSticker('Còn 3'));

        expect(find.text('Còn 3'), findsOneWidget);
      });

      testWidgets('a sold-out offer in words', (tester) async {
        await tester.pumpApp(
          const AppSticker('Đã hết', tone: AppStickerTone.soldOut),
        );

        expect(find.text('Đã hết'), findsOneWidget);
      });
    });
  });
}
