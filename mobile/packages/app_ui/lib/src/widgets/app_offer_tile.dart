import 'package:app_ui/app_ui.dart';

/// {@template app_offer_tile}
/// The compact card of a grid (DESIGN.md › Compact offer card): the
/// photograph with the stock sticker and a Deep Leaf deal strip of discount
/// and window, then the dish, the price and the seller, under a bitten
/// corner. Every word is passed in, already in the reader's language.
/// {@endtemplate}
class AppOfferTile extends StatelessWidget {
  /// {@macro app_offer_tile}
  const new({
    required this.sellerName,
    required this.sellerSeed,
    required this.dishName,
    required this.stockLabel,
    required this.windowLabel,
    required this.discountLabel,
    required this.discountSemanticLabel,
    required this.price,
    required this.originalPrice,
    required this.originalPriceLabel,
    this.soldOut = false,
    this.photo,
    super.key,
  });

  // The web's gap-1.5 between the lines of the card, and its 2.5 insets.
  static const double _gap = SpacingTokens.space1 * 1.5;
  static const double _inset = SpacingTokens.space1 * 2.5;

  /// The seller's name.
  final String sellerName;

  /// What picks the seller's avatar colour, such as their id.
  final String sellerSeed;

  /// The dish.
  final String dishName;

  /// The sticker: "Còn 3", or "Đã hết" when [soldOut].
  final String stockLabel;

  /// When to collect, such as "Lấy 21:00–21:45".
  final String windowLabel;

  /// The discount as written on the strip, such as "-58%".
  final String discountLabel;

  /// The discount as read aloud, such as "Giảm 58%".
  final String discountSemanticLabel;

  /// The price now.
  final String price;

  /// The price before the discount.
  final String originalPrice;

  /// The price before the discount as read aloud.
  final String originalPriceLabel;

  /// Whether nothing is left: the photograph fades and the sticker says so.
  final bool soldOut;

  /// The dish's photograph; a leaf wash without one.
  final ImageProvider? photo;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final image = photo;
    final placeholder = ColoredBox(
      color: Theme.of(context).colorScheme.secondary,
    );

    return Card(
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                height: 132,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Opacity(
                      opacity: soldOut ? 0.45 : 1,
                      child: image == null
                          ? placeholder
                          : Image(
                              image: image,
                              fit: BoxFit.cover,
                              excludeFromSemantics: true,
                              errorBuilder: (_, _, _) => placeholder,
                            ),
                    ),
                    Positioned(
                      top: _inset,
                      left: _inset,
                      child: AppSticker(
                        stockLabel,
                        tone: soldOut
                            ? AppStickerTone.soldOut
                            : AppStickerTone.fresh,
                      ),
                    ),
                    Positioned(
                      left: 0,
                      right: SpacingTokens.space4,
                      bottom: 0,
                      child: Align(
                        alignment: AlignmentDirectional.bottomStart,
                        child: _DealStrip(
                          discountLabel: discountLabel,
                          discountSemanticLabel: discountSemanticLabel,
                          windowLabel: windowLabel,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                  left: SpacingTokens.space3,
                  right: SpacingTokens.space3,
                  top: _inset,
                  bottom: SpacingTokens.space3,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: _gap,
                  children: [
                    Text(
                      dishName,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: text.bodySmStrong.copyWith(
                        color: scheme.onSurface,
                      ),
                    ),
                    AppPrice(
                      price: price,
                      originalPrice: originalPrice,
                      originalPriceLabel: originalPriceLabel,
                      size: AppPriceSize.compact,
                    ),
                    Row(
                      spacing: _gap,
                      children: [
                        AppSellerAvatar(
                          name: sellerName,
                          seed: sellerSeed,
                          size: AppSellerAvatarSize.small,
                        ),
                        Expanded(
                          child: Text(
                            sellerName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: text.label.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Positioned(top: 0, right: 0, child: AppBiteCorner(size: 44)),
        ],
      ),
    );
  }
}

/// The Deep Leaf strip at the foot of the photograph: the discount in lime
/// and the window in white.
class _DealStrip extends StatelessWidget {
  const new({
    required this.discountLabel,
    required this.discountSemanticLabel,
    required this.windowLabel,
  });

  final String discountLabel;
  final String discountSemanticLabel;
  final String windowLabel;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.primary,
        borderRadius: const BorderRadius.only(
          topRight: Radius.circular(RadiusTokens.lg),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppOfferTile._inset,
          vertical: SpacingTokens.space1,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: AppOfferTile._gap,
          children: [
            Semantics(
              label: discountSemanticLabel,
              excludeSemantics: true,
              child: Text(
                discountLabel,
                style: text.figureSm.copyWith(color: colors.fresh),
              ),
            ),
            Flexible(
              child: Text(
                windowLabel,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: text.label.copyWith(color: scheme.onPrimary),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
