import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/ui/cart_parts.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template seller_dish}
/// One dish on its store's page, as the web's `SellerDish` (Figma K4b): its
/// 100-point photograph with the discount, the dish, the price over the one
/// before and the portions left, and its − and +. The photograph and the
/// name open the dish's sheet; the dish a link led to is tinted.
/// {@endtemplate}
class SellerDish extends StatelessWidget {
  /// {@macro seller_dish}
  const new(this.offer, {this.focused = false, super.key});

  /// The dish.
  final OfferSummary offer;

  /// Whether a link led to this dish.
  final bool focused;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    final text = context.appTextStyles;
    final original = formatPrice(offer.originalPriceVnd);
    void open() => showDishSheet(context, offer);

    return Container(
      padding: focused ? const EdgeInsets.all(10) : EdgeInsets.zero,
      decoration: focused
          ? BoxDecoration(
              color: scheme.secondary,
              borderRadius: BorderRadius.circular(RadiusTokens.xl),
            )
          : null,
      child: Row(
        spacing: 14,
        children: [
          GestureDetector(
            onTap: open,
            child: ExcludeSemantics(child: _DishPhoto(offer: offer, size: 100)),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 10,
              children: [
                Semantics(
                  button: true,
                  child: GestureDetector(
                    onTap: open,
                    child: Text(
                      offer.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: text.title,
                    ),
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 2,
                  children: [
                    _PriceLine(
                      offer: offer,
                      originalLabel: l10n.offerOriginalPrice(original),
                    ),
                    CartPortions(offer),
                  ],
                ),
              ],
            ),
          ),
          CartStepper(offer),
        ],
      ),
    );
  }
}

/// Opens [offer]'s sheet over its store's page, as the web's `DishSheet`
/// on a phone.
Future<void> showDishSheet(BuildContext context, OfferSummary offer) =>
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      showDragHandle: true,
      builder: (_) => DishSheet(offer),
    );

/// {@template dish_sheet}
/// A dish's sheet (Figma K4a): its photograph with the discount, name, price
/// over the one before and the portions left, what the store says of it with
/// its weight, what to bring and ask; at the foot how many to add, from one
/// up to what the cart can still take, and "Thêm vào giỏ" with their price.
/// {@endtemplate}
class DishSheet extends ConsumerStatefulWidget {
  /// {@macro dish_sheet}
  const new(this.offer, {super.key});

  /// The dish.
  final OfferSummary offer;

  @override
  ConsumerState<DishSheet> createState() => _DishSheetState();
}

class _DishSheetState extends ConsumerState<DishSheet> {
  // Opened afresh each time, so the count starts again at one.
  int _count = 1;

  @override
  Widget build(BuildContext context) {
    final offer = widget.offer;
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final muted = text.bodySm.copyWith(color: scheme.onSurfaceVariant);
    final room =
        offer.mostPerOrder -
        quantityOf(ref.watch(keptCartProvider).value, offer.id);
    final original = formatPrice(offer.originalPriceVnd);
    final weight = offer.weightGrams;
    final about = [
      offer.description.trim(),
      if (weight != null && weight > 0) l10n.dishWeight(weight),
    ].where((part) => part.isNotEmpty).join(' ');

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Flexible(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(
              SpacingTokens.space4,
              0,
              SpacingTokens.space4,
              SpacingTokens.space4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space4,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(RadiusTokens.xl),
                  child: SizedBox(
                    height: 200,
                    child: _DishPhoto(offer: offer, large: true),
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: SpacingTokens.space2,
                  children: [
                    Semantics(
                      header: true,
                      child: Text(offer.name, style: text.headline),
                    ),
                    _PriceLine(
                      offer: offer,
                      originalLabel: l10n.offerOriginalPrice(original),
                    ),
                    CartPortions(offer),
                  ],
                ),
                if (about.isNotEmpty)
                  _SheetSection(
                    title: l10n.dishAbout,
                    child: Text(about, style: muted),
                  ),
                _SheetSection(
                  title: l10n.dishNotes,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('•  ${l10n.dishBringBag}', style: muted),
                      Text('•  ${l10n.dishAskSeller}', style: muted),
                      Text('•  ${l10n.dishSellerAnswers}', style: muted),
                      Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: TextButton(
                          onPressed: () =>
                              const TermsRoute().push<void>(context),
                          child: Text(l10n.dishTerms),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: scheme.outlineVariant)),
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                SpacingTokens.space4,
                SpacingTokens.space3,
                SpacingTokens.space4,
                20,
              ),
              // With a phone's large text the stepper and the button no
              // longer fit side by side, so the button takes its own line.
              child: Wrap(
                spacing: SpacingTokens.space4,
                runSpacing: SpacingTokens.space3,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  if (room > 0)
                    AppQuantityStepper(
                      quantity: _count,
                      addLabel: l10n.cartAdd(offer.name),
                      removeLabel: l10n.cartRemove(offer.name),
                      quantityLabel: l10n.dishCount(_count, offer.name),
                      onAdd: _count < room
                          ? () => setState(() => _count++)
                          : null,
                      onRemove: _count > 1
                          ? () => setState(() => _count--)
                          : null,
                    ),
                  ConstrainedBox(
                    constraints: const BoxConstraints(minWidth: 200),
                    child: AppButton(
                      onPressed: room > 0
                          ? () async {
                              await ref
                                  .read(keptCartProvider.notifier)
                                  .add(offer, _count);
                              if (context.mounted) Navigator.of(context).pop();
                            }
                          : null,
                      child: Text(
                        room > 0
                            ? l10n.dishAdd(formatPrice(_count * offer.priceVnd))
                            : offer.cappedPerOrder
                            ? l10n.dishCapChosen(offer.mostPerOrder)
                            : l10n.dishAllChosen(offer.mostPerOrder),
                      ),
                    ),
                  ),
                  // The cap is said under the button, so a customer knows
                  // why the + stops before the portions left (SEC-158).
                  if (offer.cappedPerOrder)
                    SizedBox(
                      width: double.infinity,
                      child: Text(
                        l10n.dishPerOrder(offer.perOrderMax),
                        style: text.label.copyWith(
                          color: context.appColors.warningForeground,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SheetSection extends StatelessWidget {
  const new({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: Theme.of(context).colorScheme.outlineVariant),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.only(top: SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            Semantics(
              header: true,
              child: Text(title, style: context.appTextStyles.title),
            ),
            child,
          ],
        ),
      ),
    );
  }
}

class _PriceLine extends StatelessWidget {
  const new({required this.offer, required this.originalLabel});

  final OfferSummary offer;
  final String originalLabel;

  @override
  Widget build(BuildContext context) {
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Wrap(
      spacing: 5,
      crossAxisAlignment: WrapCrossAlignment.end,
      children: [
        Text(
          formatPrice(offer.priceVnd),
          style: text.price.copyWith(color: scheme.primary),
        ),
        Semantics(
          label: originalLabel,
          excludeSemantics: true,
          child: Text(
            formatPrice(offer.originalPriceVnd),
            style: text.label.copyWith(
              color: scheme.onSurfaceVariant,
              decoration: TextDecoration.lineThrough,
            ),
          ),
        ),
      ],
    );
  }
}

/// A dish's photograph with its discount at the top left, as the web's
/// `OfferPhoto` with its `DiscountBadge`.
class _DishPhoto extends StatelessWidget {
  const new({required this.offer, this.size, this.large = false});

  final OfferSummary offer;
  final double? size;
  final bool large;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    final placeholder = ColoredBox(color: scheme.secondary);
    final path = large ? offer.photo.largePath : offer.photo.smallPath;
    final photo = Stack(
      fit: StackFit.expand,
      children: [
        Image.network(
          photoUri(path).toString(),
          fit: BoxFit.cover,
          excludeFromSemantics: true,
          errorBuilder: (_, _, _) => placeholder,
        ),
        Positioned(
          top: SpacingTokens.space2,
          left: SpacingTokens.space2,
          child: AppDiscountChip(
            label: l10n.offerDiscount(offer.discountPercent),
            semanticLabel: l10n.offerDiscountLabel(offer.discountPercent),
          ),
        ),
      ],
    );
    final side = size;
    if (side == null) return photo;
    return ClipRRect(
      borderRadius: BorderRadius.circular(RadiusTokens.lg),
      child: SizedBox.square(dimension: side, child: photo),
    );
  }
}
