// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search_offers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// The search's view model: what a [SearchQuery] finds around the chosen
/// place, what can be ordered first, as the web's `SearchResults`.

@ProviderFor(SearchOffers)
final searchOffersProvider = SearchOffersFamily._();

/// The search's view model: what a [SearchQuery] finds around the chosen
/// place, what can be ordered first, as the web's `SearchResults`.
final class SearchOffersProvider
    extends $AsyncNotifierProvider<SearchOffers, List<OfferSummary>> {
  /// The search's view model: what a [SearchQuery] finds around the chosen
  /// place, what can be ordered first, as the web's `SearchResults`.
  SearchOffersProvider._({
    required SearchOffersFamily super.from,
    required SearchQuery super.argument,
  }) : super(
         retry: _never,
         name: r'searchOffersProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$searchOffersHash();

  @override
  String toString() {
    return r'searchOffersProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  SearchOffers create() => SearchOffers();

  @override
  bool operator ==(Object other) {
    return other is SearchOffersProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$searchOffersHash() => r'66283c1fbd89880f0050035f04a76d1a816e0932';

/// The search's view model: what a [SearchQuery] finds around the chosen
/// place, what can be ordered first, as the web's `SearchResults`.

final class SearchOffersFamily extends $Family
    with
        $ClassFamilyOverride<
          SearchOffers,
          AsyncValue<List<OfferSummary>>,
          List<OfferSummary>,
          FutureOr<List<OfferSummary>>,
          SearchQuery
        > {
  SearchOffersFamily._()
    : super(
        retry: _never,
        name: r'searchOffersProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// The search's view model: what a [SearchQuery] finds around the chosen
  /// place, what can be ordered first, as the web's `SearchResults`.

  SearchOffersProvider call(SearchQuery query) =>
      SearchOffersProvider._(argument: query, from: this);

  @override
  String toString() => r'searchOffersProvider';
}

/// The search's view model: what a [SearchQuery] finds around the chosen
/// place, what can be ordered first, as the web's `SearchResults`.

abstract class _$SearchOffers extends $AsyncNotifier<List<OfferSummary>> {
  late final _$args = ref.$arg as SearchQuery;
  SearchQuery get query => _$args;

  FutureOr<List<OfferSummary>> build(SearchQuery query);
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
