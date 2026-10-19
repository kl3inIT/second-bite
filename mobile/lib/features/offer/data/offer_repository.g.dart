// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The [OfferRepository] over the app's one client.

@ProviderFor(offerRepository)
final offerRepositoryProvider = OfferRepositoryProvider._();

/// The [OfferRepository] over the app's one client.

final class OfferRepositoryProvider
    extends
        $FunctionalProvider<OfferRepository, OfferRepository, OfferRepository>
    with $Provider<OfferRepository> {
  /// The [OfferRepository] over the app's one client.
  OfferRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'offerRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$offerRepositoryHash();

  @$internal
  @override
  $ProviderElement<OfferRepository> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  OfferRepository create(Ref ref) {
    return offerRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(OfferRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<OfferRepository>(value),
    );
  }
}

String _$offerRepositoryHash() => r'5def02dcbcd5b7d451092cf9239b91d3e205ca43';
