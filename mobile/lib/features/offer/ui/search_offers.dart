import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';

part 'search_offers.g.dart';

// A failure shows at once with its retry, as on the home.
Duration? _never(int retryCount, Object error) => null;

/// The search's view model: what a [SearchQuery] finds around the chosen
/// place, what can be ordered first, as the web's `SearchResults`.
@Riverpod(retry: _never)
class SearchOffers extends _$SearchOffers {
  @override
  Future<List<OfferSummary>> build(SearchQuery query) async {
    final place = await ref.watch(keptPlaceProvider.future);
    return inShowingOrder(
      await ref.watch(offerRepositoryProvider).find(query, near: place?.near),
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
