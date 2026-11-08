// freezed reads a factory named after its class; it does not know `new`.
// ignore_for_file: unnecessary_type_name_in_constructor

import 'dart:math' as math;

import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';

part 'cart.freezed.dart';
part 'cart.g.dart';

// The cart until it is ordered, as the web's (web/src/features/cart/cart.ts,
// SEC-49 decision 7): dishes of any stores, each never more than its
// portions left or its cap per order (SEC-158), kept as the cards showed
// them so the confirmation needs no request of its own. Each store's dishes
// are a basket, ordered on its own since an order holds one store's dishes
// (SEC-15). The JSON is the web's, so the two read the same shape.

/// {@template cart_line}
/// A dish in the cart: what its card showed, and how many portions.
/// {@endtemplate}
@freezed
abstract class CartLine with _$CartLine {
  /// {@macro cart_line}
  const factory CartLine({
    required String id,
    required String name,
    required int priceVnd,
    required int originalPriceVnd,
    required int unitsLeft,
    required DateTime windowStart,
    required DateTime windowEnd,
    required int quantity,
    OfferPhotoBody? photo,
  }) = _CartLine;

  /// The line as kept on the phone.
  factory CartLine.fromJson(Map<String, Object?> json) =>
      _$CartLineFromJson(json);
}

/// {@template basket}
/// One store's dishes in the cart: one order.
/// {@endtemplate}
@freezed
abstract class Basket with _$Basket {
  /// {@macro basket}
  const factory Basket({
    required OfferSellerBody seller,
    required CollectionPointBody collectionPoint,
    required List<CartLine> lines,
    double? distanceMeters,
  }) = _Basket;

  /// The basket as kept on the phone.
  factory Basket.fromJson(Map<String, Object?> json) => _$BasketFromJson(json);
}

/// {@template cart}
/// The baskets, in the order their stores were first added; never empty.
/// {@endtemplate}
@freezed
abstract class Cart with _$Cart {
  /// {@macro cart}
  const factory Cart({required List<Basket> baskets}) = _Cart;

  /// The cart as kept on the phone.
  factory Cart.fromJson(Map<String, Object?> json) => _$CartFromJson(json);
}

/// The portions, what they cost tonight and what they would have cost.
typedef CartTotals = ({int units, int priceVnd, int originalPriceVnd});

/// One more portion of [offer], in its store's basket, never more than one
/// order may hold of it.
Cart addOne(Cart? cart, OfferSummary offer) => addPortions(cart, offer, 1);

/// [count] more portions of [offer], as the dish's sheet adds them, never
/// more than one order may hold of it: its portions left, or its cap.
Cart addPortions(Cart? cart, OfferSummary offer, int count) {
  final baskets = cart?.baskets ?? const <Basket>[];
  final basket = baskets
      .where((each) => each.seller.id == offer.sellerId)
      .firstOrNull;
  if (basket == null) {
    return Cart(baskets: [...baskets, _basketOf(offer, count)]);
  }
  final line = basket.lines.where((each) => each.id == offer.id).firstOrNull;
  final updated = _lineOf(
    offer,
    math.min((line?.quantity ?? 0) + count, offer.mostPerOrder),
  );
  final lines = [
    for (final each in basket.lines)
      if (each.id == offer.id) updated else each,
    if (line == null) updated,
  ];
  // The store's details come from the dish just added, so a basket kept from
  // earlier shows them as they are now.
  final fresh = _basketOf(offer, count);
  return Cart(
    baskets: [
      for (final each in baskets)
        if (identical(each, basket)) fresh.copyWith(lines: lines) else each,
    ],
  );
}

/// One more portion of a dish already in the cart, never more than left.
Cart oneMore(Cart cart, String offerId) => Cart(
  baskets: [
    for (final basket in cart.baskets)
      basket.copyWith(
        lines: [
          for (final line in basket.lines)
            if (line.id == offerId)
              line.copyWith(
                quantity: math.min(line.quantity + 1, line.unitsLeft),
              )
            else
              line,
        ],
      ),
  ],
);

/// One portion fewer; the dish leaves at none, its basket with its last
/// dish, the cart with its last basket.
Cart? removeOne(Cart cart, String offerId) => _keep(
  cart.baskets.map(
    (basket) => basket.copyWith(
      lines: [
        for (final line in basket.lines)
          if (line.id != offerId)
            line
          else if (line.quantity > 1)
            line.copyWith(quantity: line.quantity - 1),
      ],
    ),
  ),
);

/// The dish and all its portions out of the cart.
Cart? removeLine(Cart cart, String offerId) => _keep(
  cart.baskets.map(
    (basket) => basket.copyWith(
      lines: [...basket.lines.where((line) => line.id != offerId)],
    ),
  ),
);

/// Whether the dish's window to collect it has closed at [now]: it can no
/// longer be ordered, only taken out.
bool isOver(CartLine line, DateTime now) => !line.windowEnd.isAfter(now);

/// The cart without the dishes whose window has closed at [now]: what is
/// ordered and counted. Null when nothing is left to order.
Cart? orderable(Cart cart, DateTime now) => _keep(
  cart.baskets.map(
    (basket) => basket.copyWith(
      lines: [...basket.lines.where((line) => !isOver(line, now))],
    ),
  ),
);

/// The cart with a store's basket put in place of theirs, or taken out when
/// null.
Cart? withBasket(Cart cart, String sellerId, Basket? basket) => _keep([
  for (final each in cart.baskets)
    if (each.seller.id != sellerId) each else ?basket,
]);

/// How many portions of the dish the cart holds.
int quantityOf(Cart? cart, String offerId) {
  for (final basket in cart?.baskets ?? const <Basket>[]) {
    for (final line in basket.lines) {
      if (line.id == offerId) return line.quantity;
    }
  }
  return 0;
}

/// The portions of [lines], what they cost tonight and what they would have
/// cost: the cart's bar.
CartTotals totalsOf(Iterable<CartLine> lines) => lines.fold(
  (units: 0, priceVnd: 0, originalPriceVnd: 0),
  (sum, line) => (
    units: sum.units + line.quantity,
    priceVnd: sum.priceVnd + line.quantity * line.priceVnd,
    originalPriceVnd:
        sum.originalPriceVnd + line.quantity * line.originalPriceVnd,
  ),
);

/// Every line of the cart.
extension CartLines on Cart {
  /// The lines of every basket, in order.
  Iterable<CartLine> get lines => baskets.expand((basket) => basket.lines);
}

/// When every dish in the basket can be collected, or the earliest window
/// when they share no time.
({DateTime windowStart, DateTime windowEnd}) collectionWindow(Basket basket) {
  final start = basket.lines
      .map((line) => line.windowStart)
      .reduce((a, b) => a.isAfter(b) ? a : b);
  final end = basket.lines
      .map((line) => line.windowEnd)
      .reduce((a, b) => a.isBefore(b) ? a : b);
  if (start.isBefore(end)) return (windowStart: start, windowEnd: end);
  final earliest = basket.lines.reduce(
    (a, b) => b.windowStart.isBefore(a.windowStart) ? b : a,
  );
  return (windowStart: earliest.windowStart, windowEnd: earliest.windowEnd);
}

/// A dish of a basket with fewer portions left than it holds.
typedef CutLine = ({CartLine line, int left});

/// A basket cut down to the portions still left of each dish, and the dishes
/// it cut: what someone else ordered first. The basket is null when nothing
/// is left to order.
({Basket? basket, List<CutLine> cut}) keepLeft(
  Basket basket,
  Map<String, int> left,
) {
  final cut = [
    for (final line in basket.lines)
      if ((left[line.id] ?? 0) < line.quantity)
        (line: line, left: left[line.id] ?? 0),
  ];
  final lines = [
    for (final line in basket.lines)
      if ((left[line.id] ?? 0) > 0)
        line.copyWith(quantity: math.min(line.quantity, left[line.id] ?? 0)),
  ];
  return (
    basket: lines.isEmpty ? null : basket.copyWith(lines: lines),
    cut: cut,
  );
}

/// Reads a cart kept on the phone, which anything may have written: null
/// unless it is a cart with a basket, each with a line. A cart kept while it
/// held one store is that store's basket.
Cart? readCart(Object? json) {
  if (json is! Map<String, Object?>) return null;
  try {
    final cart = json.containsKey('baskets')
        ? Cart.fromJson(json)
        : Cart(baskets: [Basket.fromJson(json)]);
    final valid =
        cart.baskets.isNotEmpty &&
        cart.baskets.every(
          (basket) =>
              basket.lines.isNotEmpty &&
              basket.lines.every((line) => line.quantity > 0),
        );
    return valid ? cart : null;
  } on Object {
    return null;
  }
}

Cart? _keep(Iterable<Basket> baskets) {
  final kept = [...baskets.where((basket) => basket.lines.isNotEmpty)];
  return kept.isEmpty ? null : Cart(baskets: kept);
}

Basket _basketOf(OfferSummary offer, int count) => Basket(
  seller: offer.seller,
  collectionPoint: offer.collectionPoint,
  distanceMeters: offer.distanceMeters,
  lines: [_lineOf(offer, math.min(count, offer.mostPerOrder))],
);

CartLine _lineOf(OfferSummary offer, int quantity) => CartLine(
  id: offer.id,
  name: offer.name,
  priceVnd: offer.priceVnd,
  originalPriceVnd: offer.originalPriceVnd,
  // As the web keeps it: the most one order may hold, so the cart's own −
  // and + stop at the cap too.
  unitsLeft: offer.mostPerOrder,
  windowStart: offer.windowStart,
  windowEnd: offer.windowEnd,
  quantity: quantity,
  photo: offer.photo,
);
