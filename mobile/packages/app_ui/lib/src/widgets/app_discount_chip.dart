import 'package:app_ui/app_ui.dart';

/// {@template app_discount_chip}
/// The discount as the one lime chip, "-63%" (DESIGN.md › The One Discount
/// Rule). A screen reader hears [semanticLabel], such as "Giảm 63%", instead
/// of the minus sign.
/// {@endtemplate}
class AppDiscountChip extends StatelessWidget {
  /// {@macro app_discount_chip}
  const new({required this.label, required this.semanticLabel, super.key});

  /// The discount as written on the chip, such as "-63%".
  final String label;

  /// The discount as read aloud, such as "Giảm 63%".
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Semantics(
      label: semanticLabel,
      excludeSemantics: true,
      child: DecoratedBox(
        decoration: ShapeDecoration(
          color: colors.fresh,
          shape: const StadiumBorder(),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: SpacingTokens.space2,
            vertical: SpacingTokens.space1 / 2,
          ),
          child: Text(
            label,
            maxLines: 1,
            style: context.appTextStyles.figureSm.copyWith(
              color: colors.freshForeground,
            ),
          ),
        ),
      ),
    );
  }
}
