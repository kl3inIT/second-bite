import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_offers.dart';
import 'package:second_bite/features/offer/ui/offer_cards.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/seller/data/follows.dart';
import 'package:second_bite/features/seller/ui/follow_button.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template favourites_screen}
/// "Yêu thích" at `/favourites` (SEC-109, Figma K9, K9a), as the web's on a
/// phone: one card for each followed store, newest first, with its dishes on
/// sale tonight in a row, or the line that it has none; the empty state
/// while no store is followed. Tonight's dishes are the home's, around the
/// chosen place.
/// {@endtemplate}
class FavouritesScreen extends ConsumerWidget {
  /// {@macro favourites_screen}
  const new({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final follows = ref.watch(followsProvider);
    final offers = ref.watch(homeOffersProvider(everyOffer));
    Future<void> reload() => Future.wait([
      ref.refresh(followsProvider.future),
      ref.read(homeOffersProvider(everyOffer).notifier).reload(),
    ]);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.favouritesTitle)),
      body: switch ((follows, offers)) {
        (AsyncData(value: final followed), AsyncData(value: final tonight)) =>
          followed.ids.isEmpty
              ? const _NoFavourites()
              : RefreshIndicator(
                  onRefresh: reload,
                  child: _Sellers(followed: followed, offers: tonight),
                ),
        (AsyncError(:final error), _) || (_, AsyncError(:final error)) =>
          OrderFailure(error: error, onRetry: reload),
        _ => Semantics(label: l10n.favouritesTitle, child: const _Loading()),
      },
    );
  }
}

/// The followed stores, newest first.
class _Sellers extends ConsumerWidget {
  const new({required this.followed, required this.offers});

  final Followed followed;
  final List<OfferSummary> offers;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final profiles = switch (followed) {
      FollowedByAccount(:final sellers) => {
        for (final seller in sellers) seller.id: seller,
      },
      FollowedHere() => const <String, SellerProfileBody>{},
    };

    return ListView(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      children: [
        Text(
          l10n.favouritesIntro,
          style: context.appTextStyles.bodySm.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: SpacingTokens.space3),
        for (final id in followed.ids)
          _SellerCard(
            sellerId: id,
            offers: inShowingOrder(
              offers.where((offer) => offer.sellerId == id).toList(),
            ),
            profile: profiles[id],
          ),
      ],
    );
  }
}

/// One followed store: its avatar beside its name, its floor, the red
/// heart; tonight's dishes in a row that scrolls sideways, or the line that
/// there are none. A store with no dish tonight is read on its own; one
/// that is gone is left out.
class _SellerCard extends ConsumerWidget {
  const new({required this.sellerId, required this.offers, this.profile});

  final String sellerId;
  final List<OfferSummary> offers;
  final SellerProfileBody? profile;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lead = offers.firstOrNull?.seller;
    final known =
        profile ??
        (lead == null
            ? ref.watch(sellerProfileProvider(sellerId)).value
            : null);
    final name = lead?.name ?? known?.name;
    final address = lead?.address ?? known?.address;
    if (name == null || address == null) return const SizedBox.shrink();

    final l10n = context.l10n;
    final text = context.appTextStyles;
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;

    return Padding(
      padding: const EdgeInsets.only(bottom: SpacingTokens.space3),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: SpacingTokens.space3,
            children: [
              Row(
                spacing: 10,
                children: [
                  AppSellerAvatar(name: name, seed: sellerId),
                  Expanded(
                    child: InkWell(
                      onTap: () => SellerRoute(id: sellerId).go(context),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: text.title,
                          ),
                          Text(
                            address,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: text.label.copyWith(color: muted),
                          ),
                        ],
                      ),
                    ),
                  ),
                  FollowButton(
                    sellerId: sellerId,
                    name: name,
                    look: FollowLook.card,
                  ),
                ],
              ),
              if (offers.isEmpty)
                Text(
                  l10n.favouritesNoneTonight,
                  style: text.bodySm.copyWith(color: muted),
                )
              else
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 11,
                    children: [
                      for (final offer in offers)
                        SizedBox(width: 160, child: OfferTile(offer)),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// No store followed yet (Figma K9a): the heart, what to do, and the way to
/// the stores.
class _NoFavourites extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: SpacingTokens.space3,
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: scheme.secondary,
              child: Icon(LucideIcons.heart, color: scheme.primary),
            ),
            Semantics(
              header: true,
              child: Text(
                l10n.favouritesEmptyTitle,
                style: text.headline,
                textAlign: TextAlign.center,
              ),
            ),
            Text(
              l10n.favouritesEmptyBody,
              style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
              textAlign: TextAlign.center,
            ),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                onPressed: () => const HomeRoute().go(context),
                child: Text(l10n.favouritesExplore),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// A white shape where the first card will be while the follows load.
class _Loading extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Align(
          alignment: Alignment.topCenter,
          child: SizedBox(
            height: 232,
            width: double.infinity,
            child: Card(
              child: ColoredBox(color: Theme.of(context).colorScheme.surface),
            ),
          ),
        ),
      ),
    );
  }
}
