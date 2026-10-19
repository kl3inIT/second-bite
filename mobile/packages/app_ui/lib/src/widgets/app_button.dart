import 'package:app_ui/app_ui.dart';

/// Visual variants for [AppButton].
enum AppButtonVariant {
  /// Deep Leaf, the one main action of a screen.
  primary,

  /// The leaf wash, a soft secondary action.
  secondary,

  /// An outlined button.
  outline,
}

/// {@template app_button}
/// DESIGN.md's button: Material's [FilledButton] and [OutlinedButton], shaped
/// and sized by [AppTheme], that darken to their `*-hover` colour when pressed.
/// {@endtemplate}
class AppButton extends StatelessWidget {
  /// {@macro app_button}
  const new({
    required this.onPressed,
    required this.child,
    this.variant = AppButtonVariant.primary,
    super.key,
  });

  /// Called when the button is tapped.
  final VoidCallback? onPressed;

  /// The button's content, typically a [Text] widget.
  final Widget child;

  /// The visual variant of the button.
  final AppButtonVariant variant;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;

    return switch (variant) {
      AppButtonVariant.primary => FilledButton(
        onPressed: onPressed,
        style: _pressedStyle(scheme.primary, colors.primaryHover),
        child: child,
      ),
      AppButtonVariant.secondary => FilledButton.tonal(
        onPressed: onPressed,
        style: _pressedStyle(scheme.secondaryContainer, colors.secondaryHover),
        child: child,
      ),
      AppButtonVariant.outline => OutlinedButton(
        onPressed: onPressed,
        child: child,
      ),
    };
  }

  /// [rest] normally and [pressed] under the finger or the pointer; a disabled
  /// button keeps the theme's disabled colour.
  static ButtonStyle _pressedStyle(Color rest, Color pressed) {
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.disabled)) return null;
        if (states.contains(WidgetState.pressed) ||
            states.contains(WidgetState.hovered)) {
          return pressed;
        }
        return rest;
      }),
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
    );
  }
}
