import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'kept_orders.g.dart';

/// An order placed without an account, and its access: what proves it is
/// theirs to whoever placed it (docs/specs/order.md › The access).
typedef KeptOrder = ({String orderId, String access});

/// How many orders are kept, as the web keeps them in its cookie.
const maxKeptOrders = 20;

final _uuid = RegExp(
  r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  caseSensitive: false,
);
final _access = RegExp(r'^[A-Za-z0-9_-]{16,64}$');

/// {@template kept_orders}
/// The orders placed on this phone without an account, newest first, at
/// most [maxKeptOrders], each with its access (SEC-204 › design 3), as the
/// web keeps them in an httpOnly cookie (web/src/features/orders/
/// order-access.ts). The access is a secret, so it is kept in the Keychain
/// or the Keystore beside the session, never in `shared_preferences`.
/// {@endtemplate}
class KeptOrders {
  /// {@macro kept_orders}
  new(this._storage);

  static const _key = 'order_accesses';

  final FlutterSecureStorage _storage;

  /// The orders kept, newest first; none when the store cannot be read or
  /// holds anything else, so a broken store never stops the app.
  Future<List<KeptOrder>> read() async {
    try {
      return readKeptOrders(await _storage.read(key: _key));
    } on Object catch (error) {
      debugPrint('The kept orders could not be read: ${error.runtimeType}');
      return const [];
    }
  }

  /// Keeps [orderId] and its [access] first, dropping it from further down
  /// and the oldest past [maxKeptOrders]. An order or access that is not
  /// one is not kept.
  Future<void> keep(String orderId, String access) async {
    if (!_uuid.hasMatch(orderId) || !_access.hasMatch(access)) return;
    final kept = [
      (orderId: orderId, access: access),
      ...(await read()).where((each) => each.orderId != orderId),
    ].take(maxKeptOrders);
    await _storage.write(
      key: _key,
      value: jsonEncode([
        for (final each in kept) [each.orderId, each.access],
      ]),
    );
  }

  /// The access of [orderId], when it is kept.
  Future<String?> accessOf(String orderId) async {
    for (final each in await read()) {
      if (each.orderId == orderId) return each.access;
    }
    return null;
  }
}

/// Reads the kept orders as stored, `[[orderId, access], …]`, skipping any
/// pair that is not one.
@visibleForTesting
List<KeptOrder> readKeptOrders(String? stored) {
  if (stored == null) return const [];
  final Object? json;
  try {
    json = jsonDecode(stored);
  } on FormatException {
    return const [];
  }
  if (json is! List) return const [];
  return [
    for (final pair in json)
      if (pair case [final String orderId, final String access]
          when _uuid.hasMatch(orderId) && _access.hasMatch(access))
        (orderId: orderId, access: access),
  ].take(maxKeptOrders).toList();
}

/// The app's [KeptOrders].
@Riverpod(keepAlive: true)
KeptOrders keptOrders(Ref ref) => KeptOrders(const FlutterSecureStorage());
