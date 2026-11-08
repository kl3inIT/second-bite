import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/domain/contact.dart';

part 'order_repository.g.dart';

/// {@template order_repository}
/// Placing a cart's orders and what the cart reads to place them, from the
/// generated client (docs/specs/order.md): `POST /orders`, a dish's
/// portions left, and the promotions running for some stores.
/// {@endtemplate}
class OrderRepository {
  /// {@macro order_repository}
  const new(this._api);

  final SecondBiteApi _api;

  /// Places [basket]'s order for [contact], under [idempotencyKey], one of
  /// the cart's [checkoutId]. A refusal is the client's `DioException`.
  Future<OrderBody> place(
    Basket basket,
    Contact contact, {
    required String idempotencyKey,
    required String checkoutId,
  }) => _api.orders.placeOrder(
    idempotencyKey: idempotencyKey,
    body: PlaceOrderBody(
      lines: [
        for (final line in basket.lines)
          OrderWantedBody(offerId: line.id, units: line.quantity),
      ],
      name: contact.name,
      phone: contact.phone,
      checkoutId: checkoutId,
    ),
  );

  /// The portions of [offerId] on sale now; none when it is no longer on
  /// sale or cannot be read, so it counts as gone.
  Future<int> portionsLeft(String offerId) async {
    try {
      final offer = await _api.offers.getOffer(offerId: offerId);
      return offer.status == OfferBodyStatus.onSale ? offer.unitsLeft : 0;
    } on Object {
      return 0;
    }
  }

  /// The promotions running for [sellerIds].
  Future<List<RunningPromotionBody>> runningPromotions(
    List<String> sellerIds,
  ) async =>
      (await _api.promotions.listRunningPromotions(sellerId: sellerIds))
          .promotions;
}

/// The [OrderRepository] over the app's one client.
@riverpod
OrderRepository orderRepository(Ref ref) =>
    OrderRepository(ref.watch(apiProvider));
