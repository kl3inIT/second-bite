// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_reads.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The reader's orders, the account's when someone is signed in and those
/// placed on this phone otherwise; null when neither, so the tab asks to
/// sign in (SEC-204 › design 3).

@ProviderFor(myOrders)
final myOrdersProvider = MyOrdersProvider._();

/// The reader's orders, the account's when someone is signed in and those
/// placed on this phone otherwise; null when neither, so the tab asks to
/// sign in (SEC-204 › design 3).

final class MyOrdersProvider
    extends
        $FunctionalProvider<
          AsyncValue<MyOrders?>,
          MyOrders?,
          FutureOr<MyOrders?>
        >
    with $FutureModifier<MyOrders?>, $FutureProvider<MyOrders?> {
  /// The reader's orders, the account's when someone is signed in and those
  /// placed on this phone otherwise; null when neither, so the tab asks to
  /// sign in (SEC-204 › design 3).
  MyOrdersProvider._()
    : super(
        from: null,
        argument: null,
        retry: _never,
        name: r'myOrdersProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$myOrdersHash();

  @$internal
  @override
  $FutureProviderElement<MyOrders?> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<MyOrders?> create(Ref ref) {
    return myOrders(ref);
  }
}

String _$myOrdersHash() => r'ad2c37643caa293dc853c4a6403fea9877ce69ba';

/// [orderId] as its page shows it; null when there is no such order or it
/// is someone else's. It fails with [OrderUnknown] when no one is signed in
/// and the phone holds no access to it.

@ProviderFor(orderView)
final orderViewProvider = OrderViewFamily._();

/// [orderId] as its page shows it; null when there is no such order or it
/// is someone else's. It fails with [OrderUnknown] when no one is signed in
/// and the phone holds no access to it.

final class OrderViewProvider
    extends
        $FunctionalProvider<
          AsyncValue<OrderView?>,
          OrderView?,
          FutureOr<OrderView?>
        >
    with $FutureModifier<OrderView?>, $FutureProvider<OrderView?> {
  /// [orderId] as its page shows it; null when there is no such order or it
  /// is someone else's. It fails with [OrderUnknown] when no one is signed in
  /// and the phone holds no access to it.
  OrderViewProvider._({
    required OrderViewFamily super.from,
    required String super.argument,
  }) : super(
         retry: _never,
         name: r'orderViewProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$orderViewHash();

  @override
  String toString() {
    return r'orderViewProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<OrderView?> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<OrderView?> create(Ref ref) {
    final argument = this.argument as String;
    return orderView(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is OrderViewProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$orderViewHash() => r'b2598afd78b2cc16116c6e11178ae6c62cb50330';

/// [orderId] as its page shows it; null when there is no such order or it
/// is someone else's. It fails with [OrderUnknown] when no one is signed in
/// and the phone holds no access to it.

final class OrderViewFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<OrderView?>, String> {
  OrderViewFamily._()
    : super(
        retry: _never,
        name: r'orderViewProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// [orderId] as its page shows it; null when there is no such order or it
  /// is someone else's. It fails with [OrderUnknown] when no one is signed in
  /// and the phone holds no access to it.

  OrderViewProvider call(String orderId) =>
      OrderViewProvider._(argument: orderId, from: this);

  @override
  String toString() => r'orderViewProvider';
}
