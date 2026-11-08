import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

part 'seller_offers.g.dart';

// A failure shows at once with its retry, as on the home.
Duration? _never(int retryCount, Object error) => null;

/// A store's page's view model: its offers tonight, what can be ordered
/// first, as the web's page lists them, with their distance from the place
/// the customer chose.
@Riverpod(retry: _never)
class SellerOffers extends _$SellerOffers {
  @override
  Future<List<OfferSummary>> build(String sellerId) async {
    final place = await ref.watch(keptPlaceProvider.future);
    return inShowingOrder(
      await ref
          .watch(offerRepositoryProvider)
          .ofSeller(sellerId, near: place?.near),
    );
  }

  /// Asks again, after a failure or a pull to refresh.
  Future<void> reload() async {
    ref.invalidateSelf();
    try {
      await future;
    } on Object {
      return;
    }
  }
}

/// The store a link to an offer opens, null when the offer is not known:
/// `/offers/:id` opens its store at the dish, as on the web.
@Riverpod(retry: _never)
Future<String?> sellerOfOffer(Ref ref, String offerId) =>
    ref.watch(offerRepositoryProvider).sellerOf(offerId);
