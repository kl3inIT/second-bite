import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppTheme.light', () {
    final theme = AppTheme.light;
    final scheme = theme.colorScheme;

    test('takes Material colour slots from the DESIGN.md roles', () {
      expect(scheme.brightness, Brightness.light);
      expect(scheme.primary, ColorTokens.primary);
      expect(scheme.onPrimary, ColorTokens.primaryForeground);
      expect(scheme.secondaryContainer, ColorTokens.secondary);
      expect(scheme.onSecondaryContainer, ColorTokens.secondaryForeground);
      expect(scheme.error, ColorTokens.destructive);
      expect(scheme.onSurface, ColorTokens.foreground);
      expect(scheme.onSurfaceVariant, ColorTokens.mutedForeground);
      expect(scheme.outline, ColorTokens.input);
      expect(scheme.outlineVariant, ColorTokens.border);
    });

    test('keeps every layered surface white and untinted', () {
      expect([
        scheme.surface,
        scheme.surfaceContainerLowest,
        scheme.surfaceContainerLow,
        scheme.surfaceContainer,
        scheme.surfaceContainerHigh,
        scheme.surfaceContainerHighest,
      ], everyElement(ColorTokens.card));
      expect(scheme.surfaceTint, Colors.transparent);
    });

    test('puts screens on the pale sky ground', () {
      expect(theme.scaffoldBackgroundColor, ColorTokens.background);
    });

    test('sets every text slot in a bundled typeface and in ink', () {
      final text = theme.textTheme;
      final slots = [
        text.displayLarge,
        text.displayMedium,
        text.displaySmall,
        text.headlineLarge,
        text.headlineMedium,
        text.headlineSmall,
        text.titleLarge,
        text.titleMedium,
        text.titleSmall,
        text.bodyLarge,
        text.bodyMedium,
        text.bodySmall,
        text.labelLarge,
        text.labelMedium,
        text.labelSmall,
      ];

      for (final style in slots) {
        expect(style?.fontFamily, startsWith('packages/app_ui/'));
        expect(style?.color, ColorTokens.foreground);
      }
      expect(text.bodyMedium?.fontFamily, 'packages/app_ui/Be Vietnam Pro');
      expect(text.bodyMedium?.fontSize, 14);
      expect(text.titleLarge?.fontSize, 17);
      expect(
        text.displayLarge?.fontFamily,
        'packages/app_ui/Bricolage Grotesque',
      );
    });

    test('draws the top bar in the header blue, with light status icons', () {
      final appBar = theme.appBarTheme;
      expect(appBar.backgroundColor, ColorTokens.header);
      expect(appBar.foregroundColor, ColorTokens.headerForeground);
      expect(appBar.titleTextStyle?.color, ColorTokens.headerForeground);
      expect(appBar.scrolledUnderElevation, 0);
      expect(appBar.systemOverlayStyle, SystemUiOverlayStyle.light);
      expect(appBar.shape, isNull);
    });

    testWidgets('draws the back button as a white disc with a blue arrow', (
      tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: theme,
          home: Scaffold(appBar: AppBar(leading: const BackButton())),
        ),
      );

      final disc = tester.widget<DecoratedBox>(
        find
            .descendant(
              of: find.byType(BackButton),
              matching: find.byType(DecoratedBox),
            )
            .first,
      );
      expect(
        (disc.decoration as BoxDecoration).color,
        ColorTokens.headerRaised,
      );
      final arrow = tester.widget<Icon>(find.byIcon(LucideIcons.chevronLeft));
      expect(arrow.color, ColorTokens.primary);
    });

    test('shapes buttons as DESIGN.md does, without colours', () {
      final style = theme.filledButtonTheme.style!;
      expect(style.minimumSize?.resolve({}), const Size(0, 52));
      expect(
        style.shape?.resolve({}),
        const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(RadiusTokens.xl)),
        ),
      );
      expect(style.textStyle?.resolve({}), TypeTokens.button);
      expect(style.backgroundColor, isNull);
    });

    test('outlines fields and rings them in Tasco blue on focus', () {
      final input = theme.inputDecorationTheme;
      expect(input.fillColor, ColorTokens.card);
      expect(input.enabledBorder?.borderSide.color, ColorTokens.input);
      expect(input.focusedBorder?.borderSide.color, ColorTokens.ring);
      expect(input.focusedBorder?.borderSide.width, 2);
    });

    test('lays cards flat on the ground', () {
      expect(theme.cardTheme.color, ColorTokens.card);
      expect(theme.cardTheme.elevation, 0);
    });

    test('carries the extensions', () {
      expect(theme.extension<AppColors>(), AppColors.light);
      expect(theme.extension<AppTextStyles>(), isNotNull);
      expect(theme.extension<AppSpacing>(), isNotNull);
    });
  });
}
