// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_cart.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
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

@ProviderFor(PlaceCart)
final placeCartProvider = PlaceCartProvider._();

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
final class PlaceCartProvider extends $NotifierProvider<PlaceCart, PlaceState> {
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
  PlaceCartProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'placeCartProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$placeCartHash();

  @$internal
  @override
  PlaceCart create() => PlaceCart();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PlaceState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PlaceState>(value),
    );
  }
}

String _$placeCartHash() => r'91d5f25ca301afd221d03debe400c41a981e7d78';

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

abstract class _$PlaceCart extends $Notifier<PlaceState> {
  PlaceState build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<PlaceState, PlaceState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<PlaceState, PlaceState>,
              PlaceState,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
