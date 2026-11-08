// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recent_searches.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// {@template recent_searches}
/// The words searched lately, newest first, at most five, as the web's
/// `recent-searches.ts` (Figma K2a "Tìm gần đây"). A convenience: storage
/// that fails keeps nothing.
/// {@endtemplate}

@ProviderFor(RecentSearches)
final recentSearchesProvider = RecentSearchesProvider._();

/// {@template recent_searches}
/// The words searched lately, newest first, at most five, as the web's
/// `recent-searches.ts` (Figma K2a "Tìm gần đây"). A convenience: storage
/// that fails keeps nothing.
/// {@endtemplate}
final class RecentSearchesProvider
    extends $AsyncNotifierProvider<RecentSearches, List<String>> {
  /// {@template recent_searches}
  /// The words searched lately, newest first, at most five, as the web's
  /// `recent-searches.ts` (Figma K2a "Tìm gần đây"). A convenience: storage
  /// that fails keeps nothing.
  /// {@endtemplate}
  RecentSearchesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'recentSearchesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$recentSearchesHash();

  @$internal
  @override
  RecentSearches create() => RecentSearches();
}

String _$recentSearchesHash() => r'1751a8c76ae181eb9e26ce1498c626bfea950ac1';

/// {@template recent_searches}
/// The words searched lately, newest first, at most five, as the web's
/// `recent-searches.ts` (Figma K2a "Tìm gần đây"). A convenience: storage
/// that fails keeps nothing.
/// {@endtemplate}

abstract class _$RecentSearches extends $AsyncNotifier<List<String>> {
  FutureOr<List<String>> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<List<String>>, List<String>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<List<String>>, List<String>>,
              AsyncValue<List<String>>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}

/// {@template search_view_choice}
/// The search's view, kept on the phone as the web keeps it in the browser.
/// {@endtemplate}

@ProviderFor(SearchViewChoice)
final searchViewChoiceProvider = SearchViewChoiceProvider._();

/// {@template search_view_choice}
/// The search's view, kept on the phone as the web keeps it in the browser.
/// {@endtemplate}
final class SearchViewChoiceProvider
    extends $AsyncNotifierProvider<SearchViewChoice, SearchView> {
  /// {@template search_view_choice}
  /// The search's view, kept on the phone as the web keeps it in the browser.
  /// {@endtemplate}
  SearchViewChoiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'searchViewChoiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$searchViewChoiceHash();

  @$internal
  @override
  SearchViewChoice create() => SearchViewChoice();
}

String _$searchViewChoiceHash() => r'6cf33058c3557564aff886ba2b0fa3db3011ea83';

/// {@template search_view_choice}
/// The search's view, kept on the phone as the web keeps it in the browser.
/// {@endtemplate}

abstract class _$SearchViewChoice extends $AsyncNotifier<SearchView> {
  FutureOr<SearchView> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<SearchView>, SearchView>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<SearchView>, SearchView>,
              AsyncValue<SearchView>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}
