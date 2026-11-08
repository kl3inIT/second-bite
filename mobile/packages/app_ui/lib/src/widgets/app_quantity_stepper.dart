import 'package:app_ui/app_ui.dart';

/// {@template app_quantity_stepper}
/// A dish's − and + (the web's `QuantityStepper`, Figma K4b): a lone white
/// round + while [quantity] is none, then − count + on the sky fill, the +
/// going pale when [onAdd] is null. Each round button is drawn at 28 points
/// inside a 44-point target. Every word is passed in, already in the reader's
/// language.
/// {@endtemplate}
class AppQuantityStepper extends StatelessWidget {
  /// {@macro app_quantity_stepper}
  const new({
    required this.quantity,
    required this.addLabel,
    required this.removeLabel,
    required this.quantityLabel,
    required this.onAdd,
    required this.onRemove,
    super.key,
  });

  /// How many are chosen; none shows the lone +.
  final int quantity;

  /// What + says to a screen reader, such as "Thêm một phần Bánh mì".
  final String addLabel;

  /// What − says to a screen reader.
  final String removeLabel;

  /// What the count says to a screen reader.
  final String quantityLabel;

  /// Adds one; null when no more can be added.
  final VoidCallback? onAdd;

  /// Takes one away; null when none can be taken away.
  final VoidCallback? onRemove;

  static const double _round = 28;
  static const double _target = 44;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    if (quantity == 0) {
      return _RoundButton(
        icon: LucideIcons.plus,
        label: addLabel,
        onPressed: onAdd,
        size: 32,
        background: scheme.surface,
        foreground: scheme.primary,
        raised: true,
      );
    }

    return Container(
      height: 32,
      width: 96,
      padding: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: scheme.secondary,
        borderRadius: BorderRadius.circular(RadiusTokens.full),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _RoundButton(
            icon: LucideIcons.minus,
            label: removeLabel,
            onPressed: onRemove,
            size: _round,
            background: scheme.surface,
            foreground: scheme.primary,
          ),
          Semantics(
            label: quantityLabel,
            excludeSemantics: true,
            child: Text('$quantity', style: context.appTextStyles.title),
          ),
          _RoundButton(
            icon: LucideIcons.plus,
            label: addLabel,
            onPressed: onAdd,
            size: _round,
            background: onAdd == null ? scheme.secondary : scheme.primary,
            foreground: onAdd == null
                ? scheme.onSurfaceVariant
                : scheme.onPrimary,
          ),
        ],
      ),
    );
  }
}

class _RoundButton extends StatelessWidget {
  const new({
    required this.icon,
    required this.label,
    required this.onPressed,
    required this.size,
    required this.background,
    required this.foreground,
    this.raised = false,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final double size;
  final Color background;
  final Color foreground;
  final bool raised;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      enabled: onPressed != null,
      label: label,
      excludeSemantics: true,
      child: SizedBox.square(
        dimension: size,
        child: OverflowBox(
          maxWidth: AppQuantityStepper._target,
          maxHeight: AppQuantityStepper._target,
          child: InkResponse(
            onTap: onPressed,
            radius: AppQuantityStepper._target / 2,
            child: SizedBox.square(
              dimension: AppQuantityStepper._target,
              child: Center(
                child: Material(
                  type: MaterialType.circle,
                  color: background,
                  elevation: raised ? 2 : 0,
                  child: SizedBox.square(
                    dimension: size,
                    child: Icon(
                      icon,
                      size: 16,
                      color: onPressed == null
                          ? Theme.of(context).colorScheme.onSurfaceVariant
                          : foreground,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
