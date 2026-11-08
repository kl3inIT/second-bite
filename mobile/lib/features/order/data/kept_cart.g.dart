// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kept_cart.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template kept_cart}
/// The cart, read from the phone when the app starts and written back on
/// each change (SEC-204 › design 2). Null while it is empty.
/// {@endtemplate}

@ProviderFor(KeptCart)
final keptCartProvider = KeptCartProvider._();

/// {@template kept_cart}
/// The cart, read from the phone when the app starts and written back on
/// each change (SEC-204 › design 2). Null while it is empty.
/// {@endtemplate}
final class KeptCartProvider
    extends $AsyncNotifierProvider<KeptCart, rules.Cart?> {
  /// {@template kept_cart}
  /// The cart, read from the phone when the app starts and written back on
  /// each change (SEC-204 › design 2). Null while it is empty.
  /// {@endtemplate}
  KeptCartProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'keptCartProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$keptCartHash();

  @$internal
  @override
  KeptCart create() => KeptCart();
}

String _$keptCartHash() => r'27223d911571bf2da1401c0ed3ef1ce5dae14b9c';

/// {@template kept_cart}
/// The cart, read from the phone when the app starts and written back on
/// each change (SEC-204 › design 2). Null while it is empty.
/// {@endtemplate}

abstract class _$KeptCart extends $AsyncNotifier<rules.Cart?> {
  FutureOr<rules.Cart?> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<rules.Cart?>, rules.Cart?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<rules.Cart?>, rules.Cart?>,
              AsyncValue<rules.Cart?>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}

/// The moment the cart reads its dishes' windows against, again every 30
/// seconds, so a dish whose window closes while the page is open leaves the
/// totals, as the web's `useCartNow` does.

@ProviderFor(cartNow)
final cartNowProvider = CartNowProvider._();

/// The moment the cart reads its dishes' windows against, again every 30
/// seconds, so a dish whose window closes while the page is open leaves the
/// totals, as the web's `useCartNow` does.

final class CartNowProvider
    extends
        $FunctionalProvider<AsyncValue<DateTime>, DateTime, Stream<DateTime>>
    with $FutureModifier<DateTime>, $StreamProvider<DateTime> {
  /// The moment the cart reads its dishes' windows against, again every 30
  /// seconds, so a dish whose window closes while the page is open leaves the
  /// totals, as the web's `useCartNow` does.
  CartNowProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'cartNowProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$cartNowHash();

  @$internal
  @override
  $StreamProviderElement<DateTime> $createElement($ProviderPointer pointer) =>
      $StreamProviderElement(pointer);

  @override
  Stream<DateTime> create(Ref ref) {
    return cartNow(ref);
  }
}

String _$cartNowHash() => r'16dee52099ed591cf6d51700cbc4cda587b9a661';
