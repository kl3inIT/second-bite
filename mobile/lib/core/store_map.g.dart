// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'store_map.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// How the store's map is drawn: MapLibre on Android and iOS. The browser
/// preview draws none, since MapLibre there needs the PMTiles protocol set up
/// by the page, and the preview changes no code for the web; a widget test
/// overrides it, as a platform view cannot be drawn there.

@ProviderFor(storeMapDraw)
final storeMapDrawProvider = StoreMapDrawProvider._();

/// How the store's map is drawn: MapLibre on Android and iOS. The browser
/// preview draws none, since MapLibre there needs the PMTiles protocol set up
/// by the page, and the preview changes no code for the web; a widget test
/// overrides it, as a platform view cannot be drawn there.

final class StoreMapDrawProvider
    extends $FunctionalProvider<StoreMapDraw, StoreMapDraw, StoreMapDraw>
    with $Provider<StoreMapDraw> {
  /// How the store's map is drawn: MapLibre on Android and iOS. The browser
  /// preview draws none, since MapLibre there needs the PMTiles protocol set up
  /// by the page, and the preview changes no code for the web; a widget test
  /// overrides it, as a platform view cannot be drawn there.
  StoreMapDrawProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'storeMapDrawProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$storeMapDrawHash();

  @$internal
  @override
  $ProviderElement<StoreMapDraw> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  StoreMapDraw create(Ref ref) {
    return storeMapDraw(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(StoreMapDraw value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<StoreMapDraw>(value),
    );
  }
}

String _$storeMapDrawHash() => r'5203dfd2d92ef71632022f9dd18a02d990b32505';
