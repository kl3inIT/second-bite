import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/data/order_repository.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/domain/contact.dart';
import 'package:uuid/uuid.dart';

part 'place_cart.g.dart';

/// Why a store's basket was not ordered.
sealed class PlaceProblem {
  const new();
}

/// Dishes someone else ordered first (Figma O7): [cut] are the dishes with
/// fewer portions left than the basket held, [rest] the basket cut to what
/// is left, null when nothing is.
final class PlaceGone extends PlaceProblem {
  /// The dishes of [sellerId]'s basket someone else ordered first.
  const new({required this.sellerId, required this.cut, required this.rest});

  /// The store whose basket was not ordered.
  final String sellerId;

  /// The dishes cut, each with its portions left.
  final List<CutLine> cut;

  /// The basket with what is left, or null.
  final Basket? rest;
}

/// Anything else, in the server's words when it answered, with the
/// request's reference.
final class PlaceFailed extends PlaceProblem {
  /// A refusal or no answer.
  const new({this.detail, this.reference});

  /// The server's sentence, missing when no answer came.
  final String? detail;

  /// The request's reference.
  final String? reference;
}

/// {@template place_state}
/// The cart's placing: whether it is under way, why it stopped, and the
/// orders placed so far.
/// {@endtemplate}
class PlaceState {
  /// {@macro place_state}
  const new({this.pending = false, this.problem, this.placed = const []});

  /// Whether orders are being placed.
  final bool pending;

  /// Why the last attempt stopped.
  final PlaceProblem? problem;

  /// The orders placed from this visit, in the order they were placed.
  final List<OrderBody> placed;
}

const _gone = {'ORDER_OFFER_SOLD_OUT', 'ORDER_OFFER_UNAVAILABLE'};

/// {@template place_cart}
/// Orders the cart one store at a time, since an order holds one store's
/// dishes (SEC-15 › POST /orders), as the web's `usePlaceCart`
/// (SEC-204 › design 4). Each basket goes with this visit's key and its
/// store, `{key}:{sellerId}`, so a second press or a retried request
/// returns the order placed first; a refused order writes nothing, so the
/// same key orders what is left after the sold-out sheet. A basket ordered
/// leaves the cart at once, so it is never sent again, and an order placed
/// without an account keeps its access on the phone first. When a dish ran
/// out the answer does not say which, so the dishes are read again to name
/// them; when none is short the server's own words say why.
/// {@endtemplate}
@riverpod
class PlaceCart extends _$PlaceCart {
  // Per visit of the cart's page. Apart from the key: the store's people see
  // the checkout, so it must never rebuild an Idempotency-Key.
  final String _key = const Uuid().v4();
  final String _checkoutId = const Uuid().v4();

  @override
  PlaceState build() => const PlaceState();

  /// Places [cart]'s baskets for [contact].
  Future<void> place(Cart cart, Contact contact) async {
    if (state.pending) return;
    final placed = [...state.placed];
    state = PlaceState(pending: true, placed: placed);
    final orders = ref.read(orderRepositoryProvider);
    final kept = ref.read(keptOrdersProvider);
    final keptCart = ref.read(keptCartProvider.notifier);

    for (final basket in cart.baskets) {
      try {
        final order = await orders.place(
          basket,
          contact,
          idempotencyKey: '$_key:${basket.seller.id}',
          checkoutId: _checkoutId,
        );
        final access = order.access;
        if (access != null) await kept.keep(order.id, access);
        placed.add(order);
        await keptCart.setBasket(basket.seller.id, null);
      } on Object catch (error) {
        state = PlaceState(
          placed: placed,
          problem: await _problemOf(error, basket, orders),
        );
        return;
      }
    }
    state = PlaceState(placed: placed);
  }

  /// Puts the problem away, as when its sheet is closed.
  void dismiss() => state = PlaceState(placed: state.placed);

  Future<PlaceProblem> _problemOf(
    Object error,
    Basket basket,
    OrderRepository orders,
  ) async {
    final problem = problemOf(error);
    if (_gone.contains(problem?.code)) {
      final left = {
        for (final line in basket.lines)
          line.id: await orders.portionsLeft(line.id),
      };
      final kept = keepLeft(basket, left);
      if (kept.cut.isNotEmpty) {
        return PlaceGone(
          sellerId: basket.seller.id,
          cut: kept.cut,
          rest: kept.basket,
        );
      }
    }
    return PlaceFailed(detail: problem?.detail, reference: problem?.requestId);
  }
}
