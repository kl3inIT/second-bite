import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/recent_searches.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';
import 'package:second_bite/features/offer/ui/home_offers.dart';
import 'package:second_bite/features/offer/ui/kind_picker.dart';
import 'package:second_bite/features/offer/ui/offer_cards.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/offer/ui/search_filters.dart';
import 'package:second_bite/features/offer/ui/search_offers.dart';
import 'package:second_bite/features/offer/ui/seller_dish.dart';
import 'package:second_bite/features/order/ui/cart_parts.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/l10n/l10n.dart';

/// The search's address as it came, each key as text; [SearchScreen] reads
/// it by the web's rules once it knows whether a place is chosen.
typedef SearchParams = ({
  String? q,
  String? kind,
  String? now,
  String? radiusKm,
  String? minPrice,
  String? maxPrice,
  String? from,
  String? to,
  String? sort,
});

/// {@template search_screen}
/// The search at `/search` (Figma K2, K2a, K1f), as the web's on a phone:
/// a white top bar with the back arrow and the field; while the field is
/// focused and empty, the recent searches and the popular kinds; then the
/// chips, a line saying how many were found with the switch between the
/// list grouped by store and the grid, and the dishes, around the place
/// kept on the phone. The cart's bar is at the foot.
/// {@endtemplate}
class SearchScreen extends ConsumerWidget {
  /// {@macro search_screen}
  const new({required this.params, super.key});

  /// The address's keys.
  final SearchParams params;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final place = ref.watch(keptPlaceProvider);
    if (!place.hasValue) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final near = place.value != null;
    final query = readSearchQuery(
      near: near,
      q: params.q,
      kind: params.kind,
      now: params.now,
      radiusKm: params.radiusKm,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      from: params.from,
      to: params.to,
      sort: params.sort,
    );
    return _Search(query: query, near: near);
  }
}

class _Search extends ConsumerStatefulWidget {
  const new({required this.query, required this.near});

  final SearchQuery query;
  final bool near;

  @override
  ConsumerState<_Search> createState() => _SearchState();
}

class _SearchState extends ConsumerState<_Search> {
  late final _field = TextEditingController(text: widget.query.q);
  final _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
    _field.addListener(() => setState(() {}));
    _remember();
  }

  @override
  void didUpdateWidget(_Search oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.query.q != oldWidget.query.q) {
      _field.text = widget.query.q ?? '';
      _remember();
    }
  }

  // Whatever was searched, from here or from the home's field, joins the
  // recent searches.
  void _remember() {
    final words = widget.query.q;
    if (words != null) {
      unawaited(
        Future.microtask(
          () => ref.read(recentSearchesProvider.notifier).remember(words),
        ),
      );
    }
  }

  @override
  void dispose() {
    _field.dispose();
    _focus.dispose();
    super.dispose();
  }

  void _back() {
    if (context.canPop()) {
      context.pop();
    } else {
      const HomeRoute().go(context);
    }
  }

  // A new search keeps only the words, as the web's form does.
  void _search(String words) =>
      SearchRoute(q: words.trim().isEmpty ? null : words.trim()).go(context);

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final suggesting = _focus.hasFocus && _field.text.isEmpty;

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(SpacingTokens.space2),
              child: Row(
                spacing: SpacingTokens.space1,
                children: [
                  IconButton(
                    onPressed: _back,
                    tooltip: l10n.searchBack,
                    icon: const Icon(LucideIcons.chevronLeft),
                  ),
                  Expanded(
                    child: Semantics(
                      label: l10n.searchLabel,
                      child: TextField(
                        controller: _field,
                        focusNode: _focus,
                        textInputAction: TextInputAction.search,
                        onSubmitted: _search,
                        decoration: InputDecoration(
                          hintText: l10n.searchPlaceholder,
                          prefixIcon: const Icon(LucideIcons.search, size: 20),
                          suffixIcon: _field.text.isEmpty
                              ? null
                              : IconButton(
                                  tooltip: l10n.searchClear,
                                  icon: const Icon(LucideIcons.x, size: 16),
                                  onPressed: () {
                                    _field.clear();
                                    _focus.requestFocus();
                                  },
                                ),
                          border: const OutlineInputBorder(
                            borderRadius: BorderRadius.all(
                              Radius.circular(RadiusTokens.full),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: suggesting
                  ? _Suggestions(onSearch: _search)
                  : _Results(query: widget.query, near: widget.near),
            ),
          ],
        ),
      ),
      bottomNavigationBar: suggesting ? null : const CartBar(),
    );
  }
}

/// The recent searches and the popular kinds, each with how many dishes are
/// on sale, under the focused, empty field (Figma K2a).
class _Suggestions extends ConsumerWidget {
  const new({required this.onSearch});

  final ValueChanged<String> onSearch;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;
    final recent = ref.watch(recentSearchesProvider).value ?? const [];
    final popular = kindCounts(
      ref.watch(homeOffersProvider(everyOffer)).value ?? const [],
    );

    return ListView(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      children: [
        if (recent.isNotEmpty) ...[
          Row(
            children: [
              Expanded(
                child: Semantics(
                  header: true,
                  child: Text(l10n.searchRecent, style: text.headline),
                ),
              ),
              TextButton(
                onPressed: () =>
                    ref.read(recentSearchesProvider.notifier).clear(),
                child: Text(l10n.searchClearRecent),
              ),
            ],
          ),
          for (final words in recent)
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(LucideIcons.history, size: 18, color: muted),
              title: Text(words, maxLines: 1, overflow: TextOverflow.ellipsis),
              onTap: () => onSearch(words),
              trailing: IconButton(
                tooltip: l10n.searchForget(words),
                icon: Icon(LucideIcons.x, size: 16, color: muted),
                onPressed: () =>
                    ref.read(recentSearchesProvider.notifier).forget(words),
              ),
            ),
          const SizedBox(height: SpacingTokens.space4),
        ],
        if (popular.isNotEmpty) ...[
          Semantics(
            header: true,
            child: Text(l10n.searchPopular, style: text.headline),
          ),
          for (final (:kind, :count) in popular)
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundImage: switch (kindPictures[kind]) {
                  final String asset => AssetImage(asset),
                  null => null,
                },
              ),
              title: Text(l10n.offerKind(kind.json!)),
              trailing: Text(
                l10n.searchOnSale(count),
                style: text.label.copyWith(color: muted),
              ),
              onTap: () => SearchRoute(kind: kind.json).go(context),
            ),
        ],
      ],
    );
  }
}

/// The chips, the summary with its reset and view switch, and the dishes.
class _Results extends ConsumerWidget {
  const new({required this.query, required this.near});

  final SearchQuery query;
  final bool near;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final found = ref.watch(searchOffersProvider(query));
    final view = ref.watch(searchViewChoiceProvider).value ?? SearchView.list;

    return switch (found) {
      AsyncData(value: final offers) => RefreshIndicator(
        onRefresh: () =>
            ref.read(searchOffersProvider(query).notifier).reload(),
        child: ListView(
          padding: const EdgeInsets.only(bottom: SpacingTokens.space6),
          children: [
            SearchFilters(
              query: query,
              near: near,
              sortable: offers.length > 1,
            ),
            _Summary(
              query: query,
              near: near,
              count: offers.length,
              showSwitch: offers.isNotEmpty,
              view: view,
            ),
            const SizedBox(height: SpacingTokens.space3),
            if (offers.isEmpty)
              _Nothing(onEverything: () => const SearchRoute().go(context))
            else if (view == SearchView.list)
              for (final (:seller, offers: dishes) in groupBySeller(offers))
                _SellerDishes(seller: seller, offers: dishes)
            else
              _Grid(offers: offers),
          ],
        ),
      ),
      AsyncError(:final error) => OrderFailure(
        error: error,
        onRetry: () => ref.read(searchOffersProvider(query).notifier).reload(),
      ),
      _ => Semantics(
        label: l10n.searchTitle,
        child: const Center(child: CircularProgressIndicator()),
      ),
    };
  }
}

/// How many were found, the reset when a chip narrows them, and the switch
/// between the list and the grid.
class _Summary extends ConsumerWidget {
  const new({
    required this.query,
    required this.near,
    required this.count,
    required this.showSwitch,
    required this.view,
  });

  final SearchQuery query;
  final bool near;
  final int count;
  final bool showSwitch;
  final SearchView view;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    final words = query.q;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Row(
        children: [
          Expanded(
            child: Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: SpacingTokens.space2,
              children: [
                Semantics(
                  liveRegion: true,
                  child: Text(
                    words == null
                        ? l10n.searchDishesHere(count, near ? 'near' : 'all')
                        : l10n.searchDishesFor(count, words),
                    style: context.appTextStyles.label.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ),
                if (query.filtered)
                  TextButton(
                    onPressed: () => SearchRoute(q: words).go(context),
                    child: Text(l10n.searchResetFilters),
                  ),
              ],
            ),
          ),
          if (showSwitch)
            for (final (choice, icon, label) in [
              (SearchView.grid, LucideIcons.layoutGrid, l10n.searchViewGrid),
              (SearchView.list, LucideIcons.list, l10n.searchViewList),
            ])
              Semantics(
                selected: view == choice,
                child: IconButton(
                  tooltip: label,
                  icon: Icon(icon, size: 20),
                  color: view == choice
                      ? scheme.primary
                      : scheme.onSurfaceVariant,
                  onPressed: () => ref
                      .read(searchViewChoiceProvider.notifier)
                      .choose(choice),
                ),
              ),
        ],
      ),
    );
  }
}

/// One store's dishes in the list (Figma K2b "khối quán"): its avatar, name,
/// floor and tonight's window, with the way to its page, over its rows with
/// their − and +.
class _SellerDishes extends StatelessWidget {
  const new({required this.seller, required this.offers});

  final OfferSellerBody seller;
  final List<OfferSummary> offers;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final opens = offers
        .map((offer) => offer.windowStart)
        .reduce((a, b) => a.isBefore(b) ? a : b);
    final closes = offers
        .map((offer) => offer.windowEnd)
        .reduce((a, b) => a.isAfter(b) ? a : b);
    final window = l10n.sellerWindow(formatTime(opens), formatTime(closes));

    return Semantics(
      container: true,
      label: seller.name,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          SpacingTokens.space1,
          SpacingTokens.space4,
          SpacingTokens.space6,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 14,
          children: [
            Row(
              spacing: 10,
              children: [
                AppSellerAvatar(name: seller.name, seed: seller.id),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Semantics(
                        header: true,
                        child: Text(
                          seller.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: text.title,
                        ),
                      ),
                      Text(
                        '${seller.address} · $window',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.label.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Semantics(
                  label: l10n.searchViewSellerNamed(seller.name),
                  excludeSemantics: true,
                  child: TextButton(
                    onPressed: () => SellerRoute(id: seller.id).go(context),
                    child: Text(l10n.searchViewSeller),
                  ),
                ),
              ],
            ),
            for (final offer in offers) SellerDish(offer),
          ],
        ),
      ),
    );
  }
}

/// The grid: two cards to a row on a phone, as the home's.
class _Grid extends StatelessWidget {
  const new({required this.offers});

  final List<OfferSummary> offers;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Column(
        spacing: SpacingTokens.space3,
        children: [
          for (var start = 0; start < offers.length; start += 2)
            IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: SpacingTokens.space3,
                children: [
                  for (var index = start; index < start + 2; index++)
                    Expanded(
                      child: index < offers.length
                          ? OfferTile(offers[index])
                          : const SizedBox.shrink(),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Nothing matches, with the way back to every dish.
class _Nothing extends StatelessWidget {
  const new({required this.onEverything});

  final VoidCallback onEverything;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space6),
          child: Column(
            spacing: SpacingTokens.space3,
            children: [
              Text(
                l10n.searchNothing,
                style: context.appTextStyles.headline,
                textAlign: TextAlign.center,
              ),
              AppButton(
                variant: AppButtonVariant.outline,
                onPressed: onEverything,
                child: Text(l10n.searchEverything),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
