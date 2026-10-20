import 'package:app_ui/app_ui.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template tonight_deals}
/// The bottom of the header without a filter (DESIGN.md › Deal card): the
/// biggest discounts tonight as tickets on the deep blue card, then how many
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

  static const _ticketCount = 3;

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
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: SpacingTokens.space1,
                        children: [
                          for (final offer in tickets)
                            Expanded(child: _Ticket(offer)),
                        ],
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

/// A white ticket on the deal card: the discount, the seller, and when
/// collection opens.
class _Ticket extends StatelessWidget {
  const new(this.offer);

  final OfferSummary offer;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(RadiusTokens.md),
      ),
      child: Padding(
        padding: const EdgeInsets.only(
          left: SpacingTokens.space2,
          right: SpacingTokens.space1,
          top: SpacingTokens.space2,
          bottom: SpacingTokens.space2,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space1,
          children: [
            AppDiscountChip(
              label: l10n.offerDiscount(offer.discountPercent),
              semanticLabel: l10n.offerDiscountLabel(offer.discountPercent),
            ),
            Text(
              offer.seller.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: text.labelStrong,
            ),
            Text(
              l10n.homeTicketWindow(formatTime(offer.windowStart)),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: text.label.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
