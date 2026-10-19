import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

part 'home_offers.g.dart';

// The home shows a failure at once with its own retry and pull to refresh,
// instead of Riverpod's automatic retries hiding it behind a loading state.
Duration? _never(int retryCount, Object error) => null;

/// The home's view model: the offers a [HomeQuery] asks for, loading,
/// loaded or failed. The deal card asks for the unfiltered list and the
/// grid for the filtered one; the same query is fetched once.
@Riverpod(retry: _never)
class HomeOffers extends _$HomeOffers {
  @override
  Future<List<OfferSummary>> build(HomeQuery query) =>
      ref.watch(offerRepositoryProvider).search(query);

  /// Asks for the offers again, after a failure or a pull to refresh, and
  /// completes when they have arrived or failed again; a failure is in the
  /// state, for the screen to show.
  Future<void> reload() async {
    ref.invalidateSelf();
    try {
      await future;
    } on Object {
      return;
    }
  }
}
