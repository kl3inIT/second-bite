// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_reader.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The [OrderReader] over the app's one client.

@ProviderFor(orderReader)
final orderReaderProvider = OrderReaderProvider._();

/// The [OrderReader] over the app's one client.

final class OrderReaderProvider
    extends $FunctionalProvider<OrderReader, OrderReader, OrderReader>
    with $Provider<OrderReader> {
  /// The [OrderReader] over the app's one client.
  OrderReaderProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'orderReaderProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$orderReaderHash();

  @$internal
  @override
  $ProviderElement<OrderReader> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  OrderReader create(Ref ref) {
    return orderReader(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(OrderReader value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<OrderReader>(value),
    );
  }
}

String _$orderReaderHash() => r'1f9b84a1d7a061e9aece2283dbe83ca28261b14e';
