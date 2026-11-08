import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

part 'offer_repository.g.dart';

/// {@template offer_repository}
/// Tonight's offers from the generated client: soonest window first, or best
/// match first when words are given (SEC-11 › Finding offers).
/// {@endtemplate}
class OfferRepository {
  /// {@macro offer_repository}
  const new(this._offers);

  final OffersClient _offers;

  /// The offers [query] asks for, at most 50, as the web lists them. A
  /// failure is the client's `DioException`.
  Future<List<OfferSummary>> search(HomeQuery query) async {
    final now = query.now ? DateTime.now().toUtc() : null;
    final kind = query.kind;
    final found = await _offers.searchOffers(
      q: query.q,
      kind: kind == null ? null : [kind],
      collectFrom: now,
      collectTo: now,
      limit: 50,
    );
    return found.offers;
  }

  /// A store's offers tonight, at most 50, as its page lists them on the
  /// web (`listOffers({sellerId})`).
  Future<List<OfferSummary>> ofSeller(String sellerId) async {
    final found = await _offers.searchOffers(sellerId: sellerId, limit: 50);
    return found.offers;
  }

  /// The store an offer is sold by, which a link to the offer opens: null
  /// when the server does not know the offer (`404`).
  Future<String?> sellerOf(String offerId) async {
    try {
      return (await _offers.getOffer(offerId: offerId)).sellerId;
    } on DioException catch (error) {
      if (error.response?.statusCode == 404) return null;
      rethrow;
    }
  }
}

/// The [OfferRepository] over the app's one client.
@riverpod
OfferRepository offerRepository(Ref ref) =>
    OfferRepository(ref.watch(apiProvider).offers);
