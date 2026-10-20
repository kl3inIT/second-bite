import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppHeaderCapsule, () {
    group('renders', () {
      testWidgets('its icon and label', (tester) async {
        await tester.pumpApp(
          AppHeaderCapsule(
            icon: LucideIcons.userRound,
            label: 'Đăng nhập',
            onPressed: () {},
          ),
        );

        expect(find.byIcon(LucideIcons.userRound), findsOneWidget);
        expect(find.text('Đăng nhập'), findsOneWidget);
      });

      testWidgets('a 32 point capsule in a 44 point target', (tester) async {
        await tester.pumpApp(
          AppHeaderCapsule(
            icon: LucideIcons.languages,
            tooltip: 'Switch to English',
            onPressed: () {},
          ),
        );

        expect(
          tester.getSize(find.byType(AppHeaderCapsule)).height,
          AppHeaderCapsule.target,
        );
        expect(
          tester
              .getSize(
                find.descendant(
                  of: find.byType(AppHeaderCapsule),
                  matching: find.byType(DecoratedBox),
                ),
              )
              .height,
          AppHeaderCapsule.height,
        );
      });

      testWidgets('its tooltip', (tester) async {
        await tester.pumpApp(
          AppHeaderCapsule(
            icon: LucideIcons.languages,
            tooltip: 'Switch to English',
            onPressed: () {},
          ),
        );

        expect(find.byTooltip('Switch to English'), findsOneWidget);
      });
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var pressed = 0;
      await tester.pumpApp(
        AppHeaderCapsule(
          icon: LucideIcons.userRound,
          label: 'Lan Nguyen',
          onPressed: () => pressed++,
        ),
      );

      await tester.tap(find.text('Lan Nguyen'));

      expect(pressed, 1);
    });
  });
}
