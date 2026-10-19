import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/language_button.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_header.dart';
import 'package:second_bite/features/offer/ui/home_offers.dart';
import 'package:second_bite/features/offer/ui/intro_card.dart';
import 'package:second_bite/features/offer/ui/kind_picker.dart';
import 'package:second_bite/features/offer/ui/offer_cards.dart';
import 'package:second_bite/features/offer/ui/tonight_deals.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template home_screen}
/// The customer home: tonight's offers at Tasco Mall, as the web's `/`.
/// Under the lime header, the kinds, then without a filter the introduction
/// and the windows closing first, then every offer; with a filter, the kinds
/// and what matches.
/// {@endtemplate}
class HomeScreen extends ConsumerStatefulWidget {
  /// {@macro home_screen}
  const new({this.query = everyOffer, super.key});

  /// What the address asks for.
  final HomeQuery query;

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final GlobalKey _allOffers = GlobalKey();

  /// As the web's `max-w-5xl`: wider screens get margins, not wider rows.
  static const double _maxContentWidth = 1024;

  static const int _closingCount = 6;

  void _openList() {
    final target = _allOffers.currentContext;
    if (target != null) Scrollable.ensureVisible(target);
  }

  Future<void> _reload() => Future.wait([
    ref.read(homeOffersProvider(widget.query).notifier).reload(),
    if (widget.query.filtered)
      ref.read(homeOffersProvider(everyOffer).notifier).reload(),
  ]);

  @override
  Widget build(BuildContext context) {
    final query = widget.query;
    final l10n = context.l10n;
    final offers = ref.watch(homeOffersProvider(query));
    final tonight = query.filtered ? null : offers.value;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        body: RefreshIndicator(
          onRefresh: _reload,
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: AppHomeHeader(
                  maxContentWidth: _maxContentWidth,
                  title: const PlaceHeading(),
                  action: const LanguageButton(),
                  children: [
                    SearchField(value: query.q),
                    if (tonight != null)
                      TonightDeals(offers: tonight, onOpenList: _openList),
                  ],
                ),
              ),
              SliverSafeArea(
                top: false,
                sliver: SliverToBoxAdapter(
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(
                        maxWidth: _maxContentWidth,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.only(
                          top: SpacingTokens.space1,
                          bottom: SpacingTokens.space4,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          spacing: SpacingTokens.space3,
                          children: [
                            KindPicker(query: query),
                            if (!query.filtered)
                              const Padding(
                                padding: EdgeInsets.symmetric(
                                  horizontal: SpacingTokens.space4,
                                ),
                                child: IntroCard(),
                              ),
                            ...switch (offers) {
                              AsyncData(:final value) => _loaded(value),
                              AsyncError(:final error) => [
                                _HomeError(
                                  error: error,
                                  onRetry: () => ref
                                      .read(homeOffersProvider(query).notifier)
                                      .reload(),
                                ),
                              ],
                              _ => [_HomeLoading(label: l10n.homeLoading)],
                            },
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _loaded(List<OfferSummary> offers) {
    final l10n = context.l10n;
    final filtered = widget.query.filtered;
    final closing = filtered
        ? const <OfferSummary>[]
        : closingFirst(offers).take(_closingCount).toList();

    return [
      if (closing.isNotEmpty) ...[
        AppSectionHeader(
          title: l10n.homeClosingSoon,
          action: TextButton(
            onPressed: _openList,
            child: Text(l10n.homeSeeAll),
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: SpacingTokens.space3,
            children: [for (final offer in closing) OfferCard(offer)],
          ),
        ),
      ],
      AppSectionHeader(
        key: _allOffers,
        title: filtered ? l10n.homeResults : l10n.homeAllOffers,
      ),
      if (offers.isEmpty)
        _HomeEmpty(filtered: filtered)
      else
        _OfferGrid(offers: inShowingOrder(offers)),
    ];
  }
}

/// Every offer in rows of two on a phone, more on a wider screen; the cards
/// of a row share its height.
class _OfferGrid extends StatelessWidget {
  const new({required this.offers});

  final List<OfferSummary> offers;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = switch (constraints.maxWidth) {
          < 600 => 2,
          < 900 => 3,
          _ => 4,
        };
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
          child: Column(
            spacing: SpacingTokens.space3,
            children: [
              for (var start = 0; start < offers.length; start += columns)
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: SpacingTokens.space3,
                    children: [
                      for (var index = start; index < start + columns; index++)
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
      },
    );
  }
}

/// White shapes where the cards will be while the offers load.
class _HomeLoading extends StatelessWidget {
  const new({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Widget shape({required double height, double? width}) => SizedBox(
      width: width,
      height: height,
      child: Card(
        child: Align(
          alignment: Alignment.topCenter,
          child: SizedBox(
            height: height / 2,
            width: double.infinity,
            child: ColoredBox(color: scheme.secondary),
          ),
        ),
      ),
    );

    return Semantics(
      label: label,
      liveRegion: true,
      child: ExcludeSemantics(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: SpacingTokens.space3,
            children: [
              Row(
                spacing: SpacingTokens.space3,
                children: [
                  for (var i = 0; i < 2; i++)
                    Expanded(child: shape(height: 196)),
                ],
              ),
              for (var row = 0; row < 2; row++)
                Row(
                  spacing: SpacingTokens.space3,
                  children: [
                    for (var i = 0; i < 2; i++)
                      Expanded(child: shape(height: 236)),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Nothing tonight, or nothing that matches the filter.
class _HomeEmpty extends StatelessWidget {
  const new({required this.filtered});

  final bool filtered;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: SpacingTokens.space2,
            children: [
              Text(filtered ? l10n.homeEmptyFiltered : l10n.homeEmpty),
              if (filtered)
                TextButton(
                  onPressed: () => const HomeRoute().go(context),
                  child: Text(l10n.homeShowAll),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The offers could not be loaded: the server's words when it gave some,
/// its reference to report, and a retry.
class _HomeError extends StatelessWidget {
  const new({required this.error, required this.onRetry});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final problem = problemOf(error);
    final reference = problem?.requestId;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: SpacingTokens.space4),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space4),
          child: Semantics(
            liveRegion: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space2,
              children: [
                Semantics(
                  header: true,
                  child: Text(l10n.errorTitle, style: text.headline),
                ),
                Text(
                  problem?.detail ??
                      (problem == null ? l10n.errorOffline : l10n.errorBody),
                ),
                if (reference != null)
                  Text(l10n.errorReference(reference), style: text.label),
                const SizedBox(height: SpacingTokens.space2),
                FilledButton(onPressed: onRetry, child: Text(l10n.errorRetry)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
