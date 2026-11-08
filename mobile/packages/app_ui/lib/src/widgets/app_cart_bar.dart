import 'package:app_ui/app_ui.dart';

/// {@template app_cart_bar}
/// The cart's bar at the foot of a page (the web's `CartBar`, Figma K4b
/// footer): what the portions cost tonight over what they would have cost,
/// how many and how much is saved, and an [action] at the right. Every word
/// is passed in, already in the reader's language.
/// {@endtemplate}
class AppCartBar extends StatelessWidget {
  /// {@macro app_cart_bar}
  const new({
    required this.price,
    required this.originalPrice,
    required this.originalPriceLabel,
    required this.summary,
    this.action,
    super.key,
  });

  /// What the portions cost tonight, such as "78.000đ".
  final String price;

  /// What they would have cost, struck through.
  final String originalPrice;

  /// The price before the discount as read aloud.
  final String originalPriceLabel;

  /// How many portions and how much is saved, such as "2 phần · tiết kiệm
  /// 112.000đ".
  final String summary;

  /// The bar's button, such as "Xem giỏ hàng".
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final text = context.appTextStyles;
    final button = action;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surface,
        border: Border(top: BorderSide(color: scheme.outlineVariant)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.only(
            left: SpacingTokens.space4,
            right: SpacingTokens.space4,
            top: SpacingTokens.space3,
            bottom: 20,
          ),
          child: Row(
            spacing: SpacingTokens.space4,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Wrap(
                      spacing: SpacingTokens.space1 * 1.5,
                      crossAxisAlignment: WrapCrossAlignment.end,
                      children: [
                        Text(
                          price,
                          style: text.priceLg.copyWith(color: scheme.primary),
                        ),
                        Semantics(
                          label: originalPriceLabel,
                          excludeSemantics: true,
                          child: Text(
                            originalPrice,
                            style: text.label.copyWith(
                              color: scheme.onSurfaceVariant,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Text(summary, style: text.labelStrong),
                  ],
                ),
              ),
              ?button,
            ],
          ),
        ),
      ),
    );
  }
}
