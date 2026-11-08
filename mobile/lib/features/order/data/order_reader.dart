import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';

part 'order_reader.g.dart';

/// {@template order_reader}
/// A customer's orders from the generated client, as the web's
/// web/src/features/orders/read-orders.ts reads them (SEC-204 › design 3):
/// the account's when someone is signed in, otherwise those placed on this
/// phone, each read with its access; and what a customer does to one:
/// cancel it, rate it, report a problem. The access goes as `Order-Access`
/// with every call about an order that has one.
/// {@endtemplate}
class OrderReader {
  /// {@macro order_reader}
  const new(this._orders, this._kept);

  final OrdersClient _orders;
  final KeptOrders _kept;

  /// The orders still to collect and those ended, newest first: the
  /// account's when [signedIn], otherwise those kept on this phone; null
  /// when there is no one signed in and nothing kept, so the screen asks to
  /// sign in.
  Future<({List<OrderBody> open, List<OrderBody> ended})?> myOrders({
    required bool signedIn,
  }) async {
    if (signedIn) {
      final (open, ended) = await (
        _orders.listMyOrders(state: OrdersState.open, limit: 50),
        _orders.listMyOrders(state: OrdersState.ended, limit: 50),
      ).wait;
      return (open: open.orders, ended: ended.orders);
    }
    final kept = await _readKept();
    if (kept == null) return null;
    return (
      open: kept.where(isOpen).toList(),
      ended: kept.where((order) => !isOpen(order)).toList(),
    );
  }

  /// One order, with the others placed with it from the same cart, found
  /// among the reader's own; null when there is no such order or it is
  /// someone else's, which the API answers alike with 404. It throws
  /// [OrderUnknown] when no one is signed in and the phone holds no access
  /// to it, so the screen asks to sign in.
  Future<({OrderBody order, List<OrderBody> together})?> order(
    String orderId, {
    required bool signedIn,
  }) async {
    final access = await _kept.accessOf(orderId);
    if (!signedIn && access == null) throw const OrderUnknown();
    final order = await _fetch(orderId, access);
    if (order == null) return null;
    final together = await _placedTogether(order, signedIn: signedIn);
    return (
      order: order,
      together: together.where((other) => other.id != order.id).toList(),
    );
  }

  /// Cancels [order], with the [reason] chosen in the customer's words.
  Future<OrderBody> cancel(OrderBody order, {String? reason}) =>
      _orders.cancelOrder(
        orderId: order.id,
        body: CancelOrderRequest(reason: reason),
        orderAccess: order.access,
      );

  /// Rates [order] with [stars], [tags] and a [comment].
  Future<OrderBody> review(
    OrderBody order, {
    required int stars,
    required List<ReviewOrderRequestTags> tags,
    String? comment,
  }) => _orders.reviewOrder(
    orderId: order.id,
    body: ReviewOrderRequest(stars: stars, tags: tags, comment: comment),
    orderAccess: order.access,
  );

  /// Reports what went wrong with [order].
  Future<OrderBody> reportProblem(
    OrderBody order, {
    required ReportOrderProblemRequestKind kind,
    String? note,
  }) => _orders.reportOrderProblem(
    orderId: order.id,
    body: ReportOrderProblemRequest(kind: kind, note: note),
    orderAccess: order.access,
  );

  Future<OrderBody?> _fetch(String orderId, String? access) async {
    try {
      return await _orders.getOrder(orderId: orderId, orderAccess: access);
    } on DioException catch (error) {
      if (error.response?.statusCode == 404) return null;
      rethrow;
    }
  }

  /// The orders kept on this phone, read with their accesses, newest
  /// first; null when none is kept. One the server no longer finds is
  /// left out.
  Future<List<OrderBody>?> _readKept() async {
    final kept = await _kept.read();
    if (kept.isEmpty) return null;
    final orders = await [
      for (final each in kept) _fetch(each.orderId, each.access),
    ].wait;
    return orders.nonNulls.toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  Future<List<OrderBody>> _placedTogether(
    OrderBody order, {
    required bool signedIn,
  }) async {
    final (mine, kept) = await (
      signedIn
          ? _orders
                .listMyOrders(checkout: order.checkoutId, limit: 50)
                .then((found) => found.orders)
          : Future.value(const <OrderBody>[]),
      _readKept(),
    ).wait;
    final byId = {
      for (final part in [order, ...mine, ...?kept])
        if (part.checkoutId == order.checkoutId) part.id: part,
    };
    return byCheckout(byId.values).first;
  }
}

/// No one is signed in and this phone placed no such order.
class OrderUnknown implements Exception {
  /// No one is signed in and this phone placed no such order.
  const new();
}

/// The [OrderReader] over the app's one client.
@riverpod
OrderReader orderReader(Ref ref) =>
    OrderReader(ref.watch(apiProvider).orders, ref.watch(keptOrdersProvider));
