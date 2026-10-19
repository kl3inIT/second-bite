import 'package:app_ui/app_ui.dart';

/// The two sizes of an [AppPrice].
enum AppPriceSize {
  /// `price-lg`, on an offer card: the struck price first, then the new one.
  large,

  /// `price`, on a compact card: the new price first, then the struck one.
  compact,
}

/// {@template app_price}
/// The new price in Deep Leaf beside the old one struck through (DESIGN.md ›
/// Offer card). A screen reader hears the new price, then
/// [originalPriceLabel] ("Giá gốc 95.000đ"), never the struck figure itself.
/// {@endtemplate}
class AppPrice extends StatelessWidget {
  /// {@macro app_price}
  const new({
    required this.price,
    required this.originalPrice,
    required this.originalPriceLabel,
    this.size = AppPriceSize.large,
    super.key,
  });

  /// The price now, such as "39.000đ".
  final String price;

  /// The price before the discount, such as "95.000đ".
  final String originalPrice;

  /// The price before the discount as read aloud, such as "Giá gốc 95.000đ".
  final String originalPriceLabel;

  /// Which card the price sits on.
  final AppPriceSize size;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final large = size == AppPriceSize.large;
    final current = Text(
      price,
      style: (large ? text.priceLg : text.price).copyWith(
        color: Theme.of(context).colorScheme.primary,
      ),
    );
    final original = Semantics(
      label: originalPriceLabel,
      excludeSemantics: true,
      child: Text(
        originalPrice,
        style: (large ? text.bodySm : text.label).copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
          decoration: TextDecoration.lineThrough,
          decorationColor: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    );

    return MergeSemantics(
      // Wraps instead of overflowing when the system text is large.
      child: Wrap(
        spacing: large ? SpacingTokens.space2 : SpacingTokens.space1,
        crossAxisAlignment: WrapCrossAlignment.center,
        textDirection: large ? TextDirection.rtl : null,
        children: [current, original],
      ),
    );
  }
}
