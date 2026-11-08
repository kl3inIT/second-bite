// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_offers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// A store's page's view model: its offers tonight, what can be ordered
/// first, as the web's page lists them.

@ProviderFor(SellerOffers)
final sellerOffersProvider = SellerOffersFamily._();

/// A store's page's view model: its offers tonight, what can be ordered
/// first, as the web's page lists them.
final class SellerOffersProvider
    extends $AsyncNotifierProvider<SellerOffers, List<OfferSummary>> {
  /// A store's page's view model: its offers tonight, what can be ordered
  /// first, as the web's page lists them.
  SellerOffersProvider._({
    required SellerOffersFamily super.from,
    required String super.argument,
  }) : super(
         retry: _never,
         name: r'sellerOffersProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$sellerOffersHash();

  @override
  String toString() {
    return r'sellerOffersProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  SellerOffers create() => SellerOffers();

  @override
  bool operator ==(Object other) {
    return other is SellerOffersProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$sellerOffersHash() => r'9fd5f61359706837eaeb85301fbd10ce54d8e98e';

/// A store's page's view model: its offers tonight, what can be ordered
/// first, as the web's page lists them.

final class SellerOffersFamily extends $Family
    with
        $ClassFamilyOverride<
          SellerOffers,
          AsyncValue<List<OfferSummary>>,
          List<OfferSummary>,
          FutureOr<List<OfferSummary>>,
          String
        > {
  SellerOffersFamily._()
    : super(
        retry: _never,
        name: r'sellerOffersProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// A store's page's view model: its offers tonight, what can be ordered
  /// first, as the web's page lists them.

  SellerOffersProvider call(String sellerId) =>
      SellerOffersProvider._(argument: sellerId, from: this);

  @override
  String toString() => r'sellerOffersProvider';
}

/// A store's page's view model: its offers tonight, what can be ordered
/// first, as the web's page lists them.

abstract class _$SellerOffers extends $AsyncNotifier<List<OfferSummary>> {
  late final _$args = ref.$arg as String;
  String get sellerId => _$args;

  FutureOr<List<OfferSummary>> build(String sellerId);
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref =
        this.ref as $Ref<AsyncValue<List<OfferSummary>>, List<OfferSummary>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<List<OfferSummary>>, List<OfferSummary>>,
              AsyncValue<List<OfferSummary>>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, () => build(_$args));
  }
}

/// The store a link to an offer opens, null when the offer is not known:
/// `/offers/:id` opens its store at the dish, as on the web.

@ProviderFor(sellerOfOffer)
final sellerOfOfferProvider = SellerOfOfferFamily._();

/// The store a link to an offer opens, null when the offer is not known:
/// `/offers/:id` opens its store at the dish, as on the web.

final class SellerOfOfferProvider
    extends $FunctionalProvider<AsyncValue<String?>, String?, FutureOr<String?>>
    with $FutureModifier<String?>, $FutureProvider<String?> {
  /// The store a link to an offer opens, null when the offer is not known:
  /// `/offers/:id` opens its store at the dish, as on the web.
  SellerOfOfferProvider._({
    required SellerOfOfferFamily super.from,
    required String super.argument,
  }) : super(
         retry: _never,
         name: r'sellerOfOfferProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$sellerOfOfferHash();

  @override
  String toString() {
    return r'sellerOfOfferProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<String?> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<String?> create(Ref ref) {
    final argument = this.argument as String;
    return sellerOfOffer(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is SellerOfOfferProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$sellerOfOfferHash() => r'fe7a4f2f79c16497b7d202c9ef3b873987ce7e6a';

/// The store a link to an offer opens, null when the offer is not known:
/// `/offers/:id` opens its store at the dish, as on the web.

final class SellerOfOfferFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<String?>, String> {
  SellerOfOfferFamily._()
    : super(
        retry: _never,
        name: r'sellerOfOfferProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// The store a link to an offer opens, null when the offer is not known:
  /// `/offers/:id` opens its store at the dish, as on the web.

  SellerOfOfferProvider call(String offerId) =>
      SellerOfOfferProvider._(argument: offerId, from: this);

  @override
  String toString() => r'sellerOfOfferProvider';
}
