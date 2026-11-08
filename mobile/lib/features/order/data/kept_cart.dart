import 'dart:async';
import 'dart:convert';

import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/preferences.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/order/domain/cart.dart' as rules;
import 'package:second_bite/features/order/domain/cart.dart'
    show Basket, Cart, readCart;

part 'kept_cart.g.dart';

/// Where the cart is kept, under the web's own name for it.
const cartKey = 'secondbite.cart';

/// {@template kept_cart}
/// The cart, read from the phone when the app starts and written back on
/// each change (SEC-204 › design 2). Null while it is empty.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class KeptCart extends _$KeptCart {
  @override
  Future<Cart?> build() async {
    final kept = await ref.watch(preferencesProvider).getString(cartKey);
    if (kept == null) return null;
    try {
      return readCart(jsonDecode(kept));
    } on FormatException {
      return null;
    }
  }

  /// One more portion of [offer].
  Future<void> addOne(OfferSummary offer) =>
      _save((cart) => rules.addOne(cart, offer));

  /// [count] more portions of [offer], from its sheet.
  Future<void> add(OfferSummary offer, int count) =>
      _save((cart) => rules.addPortions(cart, offer, count));

  /// One more portion of a dish already in the cart.
  Future<void> oneMore(String offerId) =>
      _save((cart) => cart == null ? null : rules.oneMore(cart, offerId));

  /// One portion fewer of a dish.
  Future<void> removeOne(String offerId) =>
      _save((cart) => cart == null ? null : rules.removeOne(cart, offerId));

  /// The dish and all its portions out of the cart.
  Future<void> removeLine(String offerId) =>
      _save((cart) => cart == null ? null : rules.removeLine(cart, offerId));

  /// A store's basket put in place of theirs, or taken out when null: an
  /// order placed, or a basket cut to what is left.
  Future<void> setBasket(String sellerId, Basket? basket) => _save(
    (cart) => cart == null ? null : rules.withBasket(cart, sellerId, basket),
  );

  Future<void> _save(Cart? Function(Cart? cart) change) async {
    final next = change(await future);
    state = AsyncData(next);
    final preferences = ref.read(preferencesProvider);
    if (next == null) {
      await preferences.remove(cartKey);
    } else {
      await preferences.setString(cartKey, jsonEncode(next));
    }
  }
}

/// The moment the cart reads its dishes' windows against, again every 30
/// seconds, so a dish whose window closes while the page is open leaves the
/// totals, as the web's `useCartNow` does.
@riverpod
Stream<DateTime> cartNow(Ref ref) async* {
  yield DateTime.now();
  yield* Stream.periodic(const Duration(seconds: 30), (_) => DateTime.now());
}
