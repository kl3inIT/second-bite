import 'package:app_ui/app_ui.dart';
import 'package:app_ui/src/theme/tokens.g.dart';
import 'package:flutter/services.dart';

/// The height of a button, from DESIGN.md's `button-primary` component.
const double _buttonHeight = 52;

/// {@template app_theme}
/// The app's one [ThemeData], built from DESIGN.md's tokens alone: Material's
/// [ColorScheme] and [TextTheme] take the roles they have a slot for, the
/// component themes follow DESIGN.md's components, and [AppColors],
/// [AppTextStyles] and [AppSpacing] carry the rest. There is no dark theme
/// until DESIGN.md defines one.
/// {@endtemplate}
abstract final class AppTheme {
  /// The light [ThemeData], the only one.
  static ThemeData get light {
    const textStyles = AppTextStyles();

    return ThemeData(
      colorScheme: _colorScheme,
      // Material puts the scaffold on `surface`, the white of the cards; the
      // page is the pale sky ground under them.
      scaffoldBackgroundColor: ColorTokens.background,
      textTheme: _textTheme(textStyles),
      // Pressed controls darken to their `*-hover` colour instead of rippling.
      splashFactory: NoSplash.splashFactory,
      // Every screen but the home has the blue top bar of Figma Mobile v3
      // (K5): the screen's name in white over the header's blue, with light
      // status bar icons (DESIGN.md › Blue Header; SEC-52). The web keeps the
      // White Shell.
      appBarTheme: AppBarTheme(
        backgroundColor: ColorTokens.header,
        foregroundColor: ColorTokens.headerForeground,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        titleTextStyle: textStyles.barTitle.copyWith(
          color: ColorTokens.headerForeground,
        ),
      ),
      // The back button is a white disc with the arrow in Tasco blue, as K5
      // draws it; the button around it keeps its 48 point target.
      actionIconTheme: ActionIconThemeData(
        backButtonIconBuilder: (context) => const DecoratedBox(
          decoration: BoxDecoration(
            color: ColorTokens.headerRaised,
            shape: BoxShape.circle,
          ),
          child: SizedBox.square(
            dimension: 36,
            child: Icon(
              LucideIcons.chevronLeft,
              size: 20,
              color: ColorTokens.primary,
            ),
          ),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(style: _buttonStyle(textStyles)),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: _buttonStyle(textStyles).copyWith(
          foregroundColor: const WidgetStatePropertyAll(ColorTokens.primary),
          side: const WidgetStatePropertyAll(
            BorderSide(color: ColorTokens.border),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: ColorTokens.link,
          textStyle: textStyles.bodySmStrong,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: ColorTokens.card,
        hintStyle: textStyles.body.copyWith(color: ColorTokens.mutedForeground),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: SpacingTokens.space4,
          vertical: SpacingTokens.space3,
        ),
        border: _fieldBorder(ColorTokens.input),
        enabledBorder: _fieldBorder(ColorTokens.input),
        focusedBorder: _fieldBorder(ColorTokens.ring, width: 2),
        errorBorder: _fieldBorder(ColorTokens.destructive),
        focusedErrorBorder: _fieldBorder(ColorTokens.destructive, width: 2),
      ),
      cardTheme: const CardThemeData(
        color: ColorTokens.card,
        elevation: 0,
        margin: EdgeInsets.zero,
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(
            Radius.circular(RadiusTokens.radius2xl),
          ),
        ),
      ),
      dialogTheme: const DialogThemeData(
        backgroundColor: ColorTokens.popover,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(
            Radius.circular(RadiusTokens.radius2xl),
          ),
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: ColorTokens.card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(RadiusTokens.radius3xl),
          ),
        ),
      ),
      // The bottom bar (Figma "Bottom nav"): white, the active tab's icon in a
      // lime pill, its label strong; the others muted.
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: ColorTokens.shell,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        height: 64,
        indicatorColor: ColorTokens.fresh,
        indicatorShape: const StadiumBorder(),
        // A tab without a screen yet is muted at half strength, as on the web.
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? textStyles.labelStrong.copyWith(color: ColorTokens.foreground)
              : textStyles.label.copyWith(color: _navigationMuted(states)),
        ),
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            size: 20,
            color: states.contains(WidgetState.selected)
                ? ColorTokens.freshForeground
                : _navigationMuted(states),
          ),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: ColorTokens.border,
        thickness: 1,
        space: 1,
      ),
      extensions: const [AppColors.light, textStyles, AppSpacing()],
    );
  }

  /// Every surface Material layers (cards, menus, dialogs, sheets, filled
  /// fields) is white, without the tint Material adds by default.
  static const _colorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: ColorTokens.primary,
    onPrimary: ColorTokens.primaryForeground,
    primaryContainer: ColorTokens.secondary,
    onPrimaryContainer: ColorTokens.secondaryForeground,
    secondary: ColorTokens.secondary,
    onSecondary: ColorTokens.secondaryForeground,
    secondaryContainer: ColorTokens.secondary,
    onSecondaryContainer: ColorTokens.secondaryForeground,
    error: ColorTokens.destructive,
    onError: ColorTokens.destructiveForeground,
    surface: ColorTokens.card,
    onSurface: ColorTokens.foreground,
    onSurfaceVariant: ColorTokens.mutedForeground,
    surfaceDim: ColorTokens.muted,
    surfaceBright: ColorTokens.card,
    surfaceContainerLowest: ColorTokens.card,
    surfaceContainerLow: ColorTokens.card,
    surfaceContainer: ColorTokens.popover,
    surfaceContainerHigh: ColorTokens.popover,
    surfaceContainerHighest: ColorTokens.card,
    surfaceTint: Colors.transparent,
    outline: ColorTokens.input,
    outlineVariant: ColorTokens.border,
    inverseSurface: ColorTokens.foreground,
    onInverseSurface: ColorTokens.card,
  );

  /// Material's fifteen slots, each on the nearest DESIGN.md role, so no slot
  /// falls back to Material's own typeface.
  static TextTheme _textTheme(AppTextStyles styles) {
    return TextTheme(
      displayLarge: styles.display,
      displayMedium: styles.display,
      displaySmall: styles.priceLg,
      headlineLarge: styles.headline,
      headlineMedium: styles.headline,
      headlineSmall: styles.headline,
      titleLarge: styles.barTitle,
      titleMedium: styles.title,
      titleSmall: styles.bodySmStrong,
      bodyLarge: styles.body,
      bodyMedium: styles.bodySm,
      bodySmall: styles.label,
      labelLarge: styles.button,
      labelMedium: styles.labelStrong,
      labelSmall: styles.label,
    ).apply(
      bodyColor: ColorTokens.foreground,
      displayColor: ColorTokens.foreground,
    );
  }

  /// The shape, size and label of every button. Colours stay out: the filled
  /// and the tonal button share this theme, so each takes its colours from the
  /// scheme or from [AppButton].
  static ButtonStyle _buttonStyle(AppTextStyles styles) {
    return ButtonStyle(
      minimumSize: const WidgetStatePropertyAll(Size(0, _buttonHeight)),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(horizontal: SpacingTokens.space6),
      ),
      shape: const WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(RadiusTokens.xl)),
        ),
      ),
      textStyle: WidgetStatePropertyAll(styles.button),
      elevation: const WidgetStatePropertyAll(0),
    );
  }

  static Color _navigationMuted(Set<WidgetState> states) =>
      states.contains(WidgetState.disabled)
      ? ColorTokens.mutedForeground.withValues(alpha: 0.5)
      : ColorTokens.mutedForeground;

  static OutlineInputBorder _fieldBorder(Color color, {double width = 1}) {
    return OutlineInputBorder(
      borderRadius: const BorderRadius.all(Radius.circular(RadiusTokens.lg)),
      borderSide: BorderSide(color: color, width: width),
    );
  }
}
