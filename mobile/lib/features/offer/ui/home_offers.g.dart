// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home_offers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The home's view model: the offers a [HomeQuery] asks for, loading,
/// loaded or failed. The deal card asks for the unfiltered list and the
/// grid for the filtered one; the same query is fetched once. They are
/// around the place the customer chose, or at every shop.

@ProviderFor(HomeOffers)
final homeOffersProvider = HomeOffersFamily._();

/// The home's view model: the offers a [HomeQuery] asks for, loading,
/// loaded or failed. The deal card asks for the unfiltered list and the
/// grid for the filtered one; the same query is fetched once. They are
/// around the place the customer chose, or at every shop.
final class HomeOffersProvider
    extends $AsyncNotifierProvider<HomeOffers, List<OfferSummary>> {
  /// The home's view model: the offers a [HomeQuery] asks for, loading,
  /// loaded or failed. The deal card asks for the unfiltered list and the
  /// grid for the filtered one; the same query is fetched once. They are
  /// around the place the customer chose, or at every shop.
  HomeOffersProvider._({
    required HomeOffersFamily super.from,
    required HomeQuery super.argument,
  }) : super(
         retry: _never,
         name: r'homeOffersProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$homeOffersHash();

  @override
  String toString() {
    return r'homeOffersProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  HomeOffers create() => HomeOffers();

  @override
  bool operator ==(Object other) {
    return other is HomeOffersProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$homeOffersHash() => r'89577078ceaa2f5ac5ccfbed6e4f0c727d5b5b4d';

/// The home's view model: the offers a [HomeQuery] asks for, loading,
/// loaded or failed. The deal card asks for the unfiltered list and the
/// grid for the filtered one; the same query is fetched once. They are
/// around the place the customer chose, or at every shop.

final class HomeOffersFamily extends $Family
    with
        $ClassFamilyOverride<
          HomeOffers,
          AsyncValue<List<OfferSummary>>,
          List<OfferSummary>,
          FutureOr<List<OfferSummary>>,
          HomeQuery
        > {
  HomeOffersFamily._()
    : super(
        retry: _never,
        name: r'homeOffersProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// The home's view model: the offers a [HomeQuery] asks for, loading,
  /// loaded or failed. The deal card asks for the unfiltered list and the
  /// grid for the filtered one; the same query is fetched once. They are
  /// around the place the customer chose, or at every shop.

  HomeOffersProvider call(HomeQuery query) =>
      HomeOffersProvider._(argument: query, from: this);

  @override
  String toString() => r'homeOffersProvider';
}

/// The home's view model: the offers a [HomeQuery] asks for, loading,
/// loaded or failed. The deal card asks for the unfiltered list and the
/// grid for the filtered one; the same query is fetched once. They are
/// around the place the customer chose, or at every shop.

abstract class _$HomeOffers extends $AsyncNotifier<List<OfferSummary>> {
  late final _$args = ref.$arg as HomeQuery;
  HomeQuery get query => _$args;

  FutureOr<List<OfferSummary>> build(HomeQuery query);
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
