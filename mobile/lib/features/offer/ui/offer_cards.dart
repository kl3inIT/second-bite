import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template offer_card}
/// An offer as the large card of a sideways row, in the reader's language.
/// {@endtemplate}
class OfferCard extends StatelessWidget {
  /// {@macro offer_card}
  const new(this.offer, {super.key});

  /// The offer shown.
  final OfferSummary offer;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final original = formatPrice(offer.originalPriceVnd);

    return AppOfferCard(
      sellerName: offer.seller.name,
      sellerSeed: offer.seller.id,
      dishName: offer.name,
      stockLabel: _stock(l10n, offer),
      soldOut: !offer.isAvailable,
      // How far the store is from the chosen place, or its floor without
      // one, as the web's card.
      windowLabel: l10n.offerWindowAt(
        formatTime(offer.windowStart),
        formatTime(offer.windowEnd),
        _distance(context, offer) ?? offer.seller.address,
      ),
      discountLabel: l10n.offerDiscount(offer.discountPercent),
      discountSemanticLabel: l10n.offerDiscountLabel(offer.discountPercent),
      price: formatPrice(offer.priceVnd),
      originalPrice: original,
      originalPriceLabel: l10n.offerOriginalPrice(original),
      photo: NetworkImage(photoUri(offer.photo.smallPath).toString()),
      onTap: () => SellerRoute(id: offer.sellerId, at: offer.id).go(context),
    );
  }
}

/// {@template offer_tile}
/// An offer as the compact card of a grid, in the reader's language.
/// {@endtemplate}
class OfferTile extends StatelessWidget {
  /// {@macro offer_tile}
  const new(this.offer, {super.key});

  /// The offer shown.
  final OfferSummary offer;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final original = formatPrice(offer.originalPriceVnd);

    return AppOfferTile(
      sellerName: offer.seller.name,
      sellerSeed: offer.seller.id,
      dishName: offer.name,
      stockLabel: _stock(l10n, offer),
      soldOut: !offer.isAvailable,
      windowLabel: switch (_distance(context, offer)) {
        final String distance => l10n.offerWindowAt(
          formatTime(offer.windowStart),
          formatTime(offer.windowEnd),
          distance,
        ),
        null => l10n.offerWindow(
          formatTime(offer.windowStart),
          formatTime(offer.windowEnd),
        ),
      },
      discountLabel: l10n.offerDiscount(offer.discountPercent),
      discountSemanticLabel: l10n.offerDiscountLabel(offer.discountPercent),
      price: formatPrice(offer.priceVnd),
      originalPrice: original,
      originalPriceLabel: l10n.offerOriginalPrice(original),
      photo: NetworkImage(photoUri(offer.photo.smallPath).toString()),
      onTap: () => SellerRoute(id: offer.sellerId, at: offer.id).go(context),
    );
  }
}

String? _distance(BuildContext context, OfferSummary offer) {
  final meters = offer.distanceMeters;
  return meters == null
      ? null
      : formatDistance(meters, Localizations.localeOf(context).languageCode);
}

String _stock(AppLocalizations l10n, OfferSummary offer) =>
    offer.isAvailable ? l10n.offerStock(offer.unitsLeft) : l10n.offerSoldOut;
