import 'dart:convert';

import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/preferences.dart';

part 'recent_searches.g.dart';

/// Where the recent searches are kept, under the web's own name.
const recentSearchesKey = 'secondbite.recent-searches';

/// Where the search's chosen view is kept, under the web's own name.
const searchViewKey = 'secondbite.search-view';

/// How many recent searches are kept, as on the web.
const int _limit = 5;

/// {@template recent_searches}
/// The words searched lately, newest first, at most five, as the web's
/// `recent-searches.ts` (Figma K2a "Tìm gần đây"). A convenience: storage
/// that fails keeps nothing.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class RecentSearches extends _$RecentSearches {
  @override
  Future<List<String>> build() async {
    try {
      final kept = await ref
          .watch(preferencesProvider)
          .getString(recentSearchesKey);
      final read = kept == null ? null : jsonDecode(kept);
      return read is List ? read.whereType<String>().take(_limit).toList() : [];
    } on Object {
      return const [];
    }
  }

  /// Puts [words] first.
  Future<void> remember(String words) => _save(
    (current) => current.firstOrNull == words
        ? current
        : [words, ...current.where((item) => item != words)].take(_limit),
  );

  /// Takes [words] out.
  Future<void> forget(String words) =>
      _save((current) => current.where((item) => item != words));

  /// Forgets them all.
  Future<void> clear() => _save((_) => const []);

  Future<void> _save(Iterable<String> Function(List<String>) change) async {
    final next = change(await future).toList();
    state = AsyncData(next);
    try {
      await ref
          .read(preferencesProvider)
          .setString(recentSearchesKey, jsonEncode(next));
    } on Object {
      // Kept for this run only.
    }
  }
}

/// How the search lays out its results: a grid of cards, or a list grouped
/// by store, the web's default.
enum SearchView {
  /// A grid of cards.
  grid,

  /// A list grouped by store.
  list,
}

/// {@template search_view_choice}
/// The search's view, kept on the phone as the web keeps it in the browser.
/// {@endtemplate}
@Riverpod(keepAlive: true)
class SearchViewChoice extends _$SearchViewChoice {
  @override
  Future<SearchView> build() async {
    try {
      final kept = await ref
          .watch(preferencesProvider)
          .getString(searchViewKey);
      return kept == '"grid"' ? SearchView.grid : SearchView.list;
    } on Object {
      return SearchView.list;
    }
  }

  /// Shows the results as [view] from now on.
  Future<void> choose(SearchView view) async {
    state = AsyncData(view);
    try {
      await ref
          .read(preferencesProvider)
          .setString(searchViewKey, jsonEncode(view.name));
    } on Object {
      // Kept for this run only.
    }
  }
}
