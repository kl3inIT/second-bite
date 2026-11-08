// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locate.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// [Locate] through `geolocator`: the permission is asked then, once.

@ProviderFor(locate)
final locateProvider = LocateProvider._();

/// [Locate] through `geolocator`: the permission is asked then, once.

final class LocateProvider extends $FunctionalProvider<Locate, Locate, Locate>
    with $Provider<Locate> {
  /// [Locate] through `geolocator`: the permission is asked then, once.
  LocateProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'locateProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$locateHash();

  @$internal
  @override
  $ProviderElement<Locate> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  Locate create(Ref ref) {
    return locate(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(Locate value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<Locate>(value),
    );
  }
}

String _$locateHash() => r'7698a6c8e801e5cc3cdee882812c17766939df97';
