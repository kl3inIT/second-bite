import 'package:app_ui/app_ui.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template tonight_deals}
/// The bottom of the header without a filter (DESIGN.md › Deal card): the
/// biggest discounts tonight as tickets on the deep blue card, each opening
/// its store at the dish, in a row that scrolls sideways when they do not fit
/// (the web runs it as a marquee), then how many
/// bags are open and when the last window closes, leading to the list. Every
/// figure comes from [offers]; with nothing to order, nothing shows. They sit
/// on the header's blue, above the sheet of AppHomeHeader, as on the web.
/// {@endtemplate}
class TonightDeals extends StatelessWidget {
  /// {@macro tonight_deals}
  const new({required this.offers, required this.onOpenList, super.key});

  /// Tonight's offers, unfiltered.
  final List<OfferSummary> offers;

  /// Shows the list of every offer.
  final VoidCallback onOpenList;

  // Tonight's biggest discounts, as many as the web's row holds.
  static const _ticketCount = 8;

  @override
  Widget build(BuildContext context) {
    final open = openBags(offers);
    if (open == null) return const SizedBox.shrink();
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    final scheme = Theme.of(context).colorScheme;
    final tickets = biggestDiscountFirst(offers).take(_ticketCount).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: SpacingTokens.space3,
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            color: colors.deal,
            borderRadius: BorderRadius.circular(RadiusTokens.radius2xl),
          ),
          child: Padding(
            padding: const EdgeInsets.only(
              left: SpacingTokens.space3,
              right: SpacingTokens.space3,
              top: SpacingTokens.space3,
              bottom: SpacingTokens.space3,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: SpacingTokens.space2,
              children: [
                Semantics(
                  header: true,
                  child: Text(
                    l10n.homeDealsTitle,
                    style: text.bodySmStrong.copyWith(color: colors.fresh),
                  ),
                ),
                Row(
                  spacing: SpacingTokens.space2,
                  children: [
                    MergeSemantics(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.homeUpTo,
                            style: text.labelStrong.copyWith(
                              color: colors.inverseMuted,
                            ),
                          ),
                          Text(
                            l10n.homeUpToPercent(tickets.first.discountPercent),
                            style: text.display.copyWith(color: colors.fresh),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          spacing: SpacingTokens.space2,
                          children: [
                            for (final offer in tickets) _Ticket(offer),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        Material(
          color: scheme.surface,
          shape: RoundedRectangleBorder(
            side: BorderSide(
              color: Theme.of(context).colorScheme.outlineVariant,
            ),
            borderRadius: BorderRadius.circular(RadiusTokens.xl),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onOpenList,
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: SpacingTokens.space3,
                  vertical: SpacingTokens.space2,
                ),
                child: Row(
                  spacing: SpacingTokens.space2,
                  children: [
                    Icon(LucideIcons.clock, size: 18, color: scheme.primary),
                    Expanded(
                      child: Text(
                        l10n.homeOpenBags(
                          open.bags,
                          formatTime(open.lastWindowEnd),
                        ),
                        style: text.bodySmStrong,
                      ),
                    ),
                    Icon(
                      LucideIcons.chevronRight,
                      size: 16,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// A white ticket on the deal card, as the web's phone shows it: the
/// discount in the sale colour, a dashed cut, then the seller, which opens
/// the store at that dish.
class _Ticket extends StatelessWidget {
  const new(this.offer);

  final OfferSummary offer;

  static const _width = 144.0;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return SizedBox(
      width: _width,
      child: Material(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(RadiusTokens.xl),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () =>
              SellerRoute(id: offer.sellerId, at: offer.id).go(context),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 72),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: SpacingTokens.space2,
                vertical: SpacingTokens.space2,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                spacing: SpacingTokens.space1,
                children: [
                  Semantics(
                    label: l10n.offerDiscountLabel(offer.discountPercent),
                    excludeSemantics: true,
                    child: Text(
                      l10n.offerDiscount(offer.discountPercent),
                      style: text.priceLg.copyWith(color: scheme.error),
                    ),
                  ),
                  const _DashedCut(),
                  Text(
                    offer.seller.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: text.bodySmStrong.copyWith(color: scheme.onSurface),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// The ticket's dashed line between the discount and the seller.
class _DashedCut extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.outlineVariant;
    return LayoutBuilder(
      builder: (context, constraints) {
        const dash = 4.0;
        final count = (constraints.maxWidth / (dash * 2)).floor();
        return Row(
          children: [
            for (var i = 0; i < count; i++)
              Padding(
                padding: const EdgeInsets.only(right: dash),
                child: SizedBox(
                  width: dash,
                  height: 1,
                  child: ColoredBox(color: color),
                ),
              ),
          ],
        );
      },
    );
  }
}
