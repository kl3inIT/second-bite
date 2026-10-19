import 'package:app_ui/app_ui.dart';

/// {@template app_offer_card}
/// The large card of a sideways row (DESIGN.md › Offer card): the photograph
/// with the stock sticker and the seller's avatar, then the seller, the
/// dish, the window and place, and the price row, under a bitten corner.
/// Every word is passed in, already in the reader's language.
/// {@endtemplate}
class AppOfferCard extends StatelessWidget {
  /// {@macro app_offer_card}
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

  /// The card's width in a sideways row.
  static const double width = 264;

  // The web's gap-1.5 between the lines of the card.
  static const double _gap = SpacingTokens.space1 * 1.5;

  /// The seller's name.
  final String sellerName;

  /// What picks the seller's avatar colour, such as their id.
  final String sellerSeed;

  /// The dish.
  final String dishName;

  /// The sticker: "Còn 3", or "Đã hết" when [soldOut].
  final String stockLabel;

  /// When and where to collect, such as "21:00–21:45 · Tầng 1".
  final String windowLabel;

  /// The discount as written on the chip, such as "-58%".
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
    final colors = context.appColors;
    final text = context.appTextStyles;
    final muted = text.label.copyWith(
      color: Theme.of(context).colorScheme.onSurfaceVariant,
    );
    final image = photo;
    final placeholder = ColoredBox(
      color: Theme.of(context).colorScheme.secondary,
    );

    return SizedBox(
      width: width,
      child: Card(
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  height: 92,
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
                      // The scrim that lets the sticker and avatar read on any
                      // photograph.
                      DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              colors.primaryHover.withValues(alpha: 0),
                              colors.primaryHover.withValues(alpha: 0.35),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        top: SpacingTokens.space3,
                        left: SpacingTokens.space3,
                        child: AppSticker(
                          stockLabel,
                          tone: soldOut
                              ? AppStickerTone.soldOut
                              : AppStickerTone.fresh,
                        ),
                      ),
                      Positioned(
                        bottom: SpacingTokens.space3,
                        left: SpacingTokens.space3,
                        child: AppSellerAvatar(
                          name: sellerName,
                          seed: sellerSeed,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                    top: 12,
                    right: 14,
                    bottom: 14,
                    left: 14,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: _gap,
                    children: [
                      Text(
                        sellerName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.title,
                      ),
                      Text(
                        dishName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.bodySm.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                      Row(
                        spacing: _gap,
                        children: [
                          Icon(
                            LucideIcons.clock,
                            size: 14,
                            color: Theme.of(context)
                                .colorScheme
                                .onSurfaceVariant,
                          ),
                          Expanded(
                            child: Text(
                              windowLabel,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: muted,
                            ),
                          ),
                        ],
                      ),
                      Row(
                        spacing: SpacingTokens.space2,
                        children: [
                          AppDiscountChip(
                            label: discountLabel,
                            semanticLabel: discountSemanticLabel,
                          ),
                          Expanded(
                            child: Align(
                              alignment: AlignmentDirectional.centerEnd,
                              child: AppPrice(
                                price: price,
                                originalPrice: originalPrice,
                                originalPriceLabel: originalPriceLabel,
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
            const Positioned(top: 0, right: 0, child: AppBiteCorner(size: 56)),
          ],
        ),
      ),
    );
  }
}
