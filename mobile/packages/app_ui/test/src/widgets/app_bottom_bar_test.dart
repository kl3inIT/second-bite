import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppBottomBar, () {
    group('renders', () {
      testWidgets('its tabs over a blur', (tester) async {
        await tester.pumpApp(const AppBottomBar(child: Text('Trang chủ')));

        expect(find.text('Trang chủ'), findsOneWidget);
        expect(find.byType(BackdropFilter), findsOneWidget);
      });

      testWidgets('16 points from the sides and the bottom', (tester) async {
        tester.view.physicalSize = const Size(390, 844);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.reset);
        await tester.pumpApp(
          const Align(
            alignment: Alignment.bottomCenter,
            child: AppBottomBar(
              child: SizedBox(width: double.infinity, height: 54),
            ),
          ),
        );

        final glass = tester.getRect(find.byType(BackdropFilter));
        expect(glass.left, SpacingTokens.space4);
        expect(glass.right, 390 - SpacingTokens.space4);
        expect(glass.bottom, 844 - SpacingTokens.space4);
        expect(glass.height, 64);
      });
    });
  });
}
