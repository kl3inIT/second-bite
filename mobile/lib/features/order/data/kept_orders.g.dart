// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kept_orders.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The app's [KeptOrders].

@ProviderFor(keptOrders)
final keptOrdersProvider = KeptOrdersProvider._();

/// The app's [KeptOrders].

final class KeptOrdersProvider
    extends $FunctionalProvider<KeptOrders, KeptOrders, KeptOrders>
    with $Provider<KeptOrders> {
  /// The app's [KeptOrders].
  KeptOrdersProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'keptOrdersProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$keptOrdersHash();

  @$internal
  @override
  $ProviderElement<KeptOrders> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  KeptOrders create(Ref ref) {
    return keptOrders(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(KeptOrders value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<KeptOrders>(value),
    );
  }
}

String _$keptOrdersHash() => r'f042767fe7c4835cedf7861ca90953b58418d1da';
