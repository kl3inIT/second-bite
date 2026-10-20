import 'package:app_ui/app_ui.dart';

/// Visual variants for [AppButton].
enum AppButtonVariant {
  /// Tasco blue, the one main action of a screen.
  primary,

  /// The pale blue wash, a soft secondary action.
  secondary,

  /// An outlined button.
  outline,

  /// The danger red, for an action that cannot be undone, such as deleting
  /// the account.
  destructive,

  /// An outline in the danger red, for the way into such an action, such as
  /// the button at the foot of account settings.
  destructiveOutline,
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
    this.icon,
    super.key,
  });

  /// Called when the button is tapped.
  final VoidCallback? onPressed;

  /// The button's content, typically a [Text] widget.
  final Widget child;

  /// The visual variant of the button.
  final AppButtonVariant variant;

  /// Drawn before [child], such as an icon or a spinner while it works.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;

    final icon = this.icon;
    return switch (variant) {
      AppButtonVariant.primary when icon != null => FilledButton.icon(
        onPressed: onPressed,
        style: _pressedStyle(scheme.primary, colors.primaryHover),
        icon: icon,
        label: child,
      ),
      AppButtonVariant.primary => FilledButton(
        onPressed: onPressed,
        style: _pressedStyle(scheme.primary, colors.primaryHover),
        child: child,
      ),
      AppButtonVariant.secondary when icon != null => FilledButton.tonalIcon(
        onPressed: onPressed,
        style: _pressedStyle(scheme.secondaryContainer, colors.secondaryHover),
        icon: icon,
        label: child,
      ),
      AppButtonVariant.secondary => FilledButton.tonal(
        onPressed: onPressed,
        style: _pressedStyle(scheme.secondaryContainer, colors.secondaryHover),
        child: child,
      ),
      AppButtonVariant.outline when icon != null => OutlinedButton.icon(
        onPressed: onPressed,
        icon: icon,
        label: child,
      ),
      AppButtonVariant.outline => OutlinedButton(
        onPressed: onPressed,
        child: child,
      ),
      AppButtonVariant.destructive when icon != null => FilledButton.icon(
        onPressed: onPressed,
        style: _destructiveStyle(scheme, colors),
        icon: icon,
        label: child,
      ),
      AppButtonVariant.destructive => FilledButton(
        onPressed: onPressed,
        style: _destructiveStyle(scheme, colors),
        child: child,
      ),
      AppButtonVariant.destructiveOutline when icon != null =>
        OutlinedButton.icon(
          onPressed: onPressed,
          style: _destructiveOutlineStyle(scheme),
          icon: icon,
          label: child,
        ),
      AppButtonVariant.destructiveOutline => OutlinedButton(
        onPressed: onPressed,
        style: _destructiveOutlineStyle(scheme),
        child: child,
      ),
    };
  }

  static ButtonStyle _destructiveOutlineStyle(ColorScheme scheme) {
    return OutlinedButton.styleFrom(
      foregroundColor: scheme.error,
      side: BorderSide(color: scheme.error),
    );
  }

  static ButtonStyle _destructiveStyle(ColorScheme scheme, AppColors colors) {
    return _pressedStyle(scheme.error, colors.destructiveHover).copyWith(
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) =>
            states.contains(WidgetState.disabled) ? null : scheme.onError,
      ),
    );
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
