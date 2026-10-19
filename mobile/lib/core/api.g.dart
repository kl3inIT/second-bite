// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The generated client of `api/openapi.yaml`, configured once: the origin,
/// lists sent comma-separated as the contract asks (`kind=bakery,drinks`),
/// and the reader's language on every call so the server's words come back
/// in it.

@ProviderFor(api)
final apiProvider = ApiProvider._();

/// The generated client of `api/openapi.yaml`, configured once: the origin,
/// lists sent comma-separated as the contract asks (`kind=bakery,drinks`),
/// and the reader's language on every call so the server's words come back
/// in it.

final class ApiProvider
    extends $FunctionalProvider<SecondBiteApi, SecondBiteApi, SecondBiteApi>
    with $Provider<SecondBiteApi> {
  /// The generated client of `api/openapi.yaml`, configured once: the origin,
  /// lists sent comma-separated as the contract asks (`kind=bakery,drinks`),
  /// and the reader's language on every call so the server's words come back
  /// in it.
  ApiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'apiProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$apiHash();

  @$internal
  @override
  $ProviderElement<SecondBiteApi> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  SecondBiteApi create(Ref ref) {
    return api(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SecondBiteApi value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SecondBiteApi>(value),
    );
  }
}

String _$apiHash() => r'12f2cb979643c23d7793575bb332a4553b6ed74c';
