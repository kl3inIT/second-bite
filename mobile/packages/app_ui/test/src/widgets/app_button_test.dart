// Not required for test files.
// ignore_for_file: prefer_const_constructors

import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group('AppButton', () {
    testWidgets('renders child', (tester) async {
      await tester.pumpApp(AppButton(onPressed: () {}, child: Text('Tap me')));

      expect(find.text('Tap me'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      var tapped = false;
      await tester.pumpApp(
        AppButton(onPressed: () => tapped = true, child: Text('Tap me')),
      );

      await tester.tap(find.byType(AppButton));
      expect(tapped, isTrue);
    });

    testWidgets('does not call onPressed when disabled', (tester) async {
      await tester.pumpApp(AppButton(onPressed: null, child: Text('Disabled')));

      await tester.tap(find.byType(AppButton));
    });

    testWidgets('renders FilledButton for primary variant', (tester) async {
      await tester.pumpApp(AppButton(onPressed: () {}, child: Text('Primary')));

      expect(find.byType(FilledButton), findsOneWidget);
    });

    testWidgets('renders FilledButton.tonal for secondary variant', (
      tester,
    ) async {
      await tester.pumpApp(
        AppButton(
          onPressed: () {},
          variant: AppButtonVariant.secondary,
          child: Text('Secondary'),
        ),
      );

      expect(find.byType(FilledButton), findsOneWidget);
    });

    testWidgets('renders OutlinedButton for outline variant', (tester) async {
      await tester.pumpApp(
        AppButton(
          onPressed: () {},
          variant: AppButtonVariant.outline,
          child: Text('Outline'),
        ),
      );

      expect(find.byType(OutlinedButton), findsOneWidget);
    });

    testWidgets('darkens the primary button to primary-hover when pressed', (
      tester,
    ) async {
      await tester.pumpApp(AppButton(onPressed: () {}, child: Text('Primary')));

      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      final background = button.style!.backgroundColor!;
      expect(background.resolve({}), AppTheme.light.colorScheme.primary);
      expect(
        background.resolve({WidgetState.pressed}),
        AppColors.light.primaryHover,
      );
      expect(background.resolve({WidgetState.disabled}), isNull);
    });

    testWidgets(
      'darkens the secondary button to secondary-hover when pressed',
      (tester) async {
        await tester.pumpApp(
          AppButton(
            onPressed: () {},
            variant: AppButtonVariant.secondary,
            child: Text('Secondary'),
          ),
        );

        final button = tester.widget<FilledButton>(find.byType(FilledButton));
        expect(
          button.style!.backgroundColor!.resolve({WidgetState.pressed}),
          AppColors.light.secondaryHover,
        );
      },
    );

    testWidgets("is as tall as DESIGN.md's button", (tester) async {
      await tester.pumpApp(
        Center(
          child: AppButton(onPressed: () {}, child: Text('Tall')),
        ),
      );

      expect(tester.getSize(find.byType(FilledButton)).height, 52);
    });

    testWidgets('draws its icon before the label, in every variant', (
      tester,
    ) async {
      for (final variant in AppButtonVariant.values) {
        await tester.pumpApp(
          AppButton(
            onPressed: () {},
            variant: variant,
            icon: Icon(LucideIcons.logOut),
            child: Text('Đăng xuất'),
          ),
        );

        expect(find.byIcon(LucideIcons.logOut), findsOneWidget);
        expect(
          tester.getCenter(find.byIcon(LucideIcons.logOut)).dx,
          lessThan(tester.getCenter(find.text('Đăng xuất')).dx),
        );
      }
    });
  });
}
