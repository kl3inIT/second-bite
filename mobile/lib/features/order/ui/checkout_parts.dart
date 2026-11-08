import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:url_launcher/url_launcher.dart';

/// {@template seller_order}
/// One store's order on the cart (Figma K5 "đơn · quán"), as the web's
/// `SellerOrder`: the store's logo, name, floor and window with the way
/// there, over its dishes, on a card with a hairline. A dish whose window
/// has closed stays, marked, until taken out.
/// {@endtemplate}
class SellerOrder extends StatelessWidget {
  /// {@macro seller_order}
  const new({required this.basket, required this.now, super.key});

  /// The store's dishes.
  final Basket basket;

  /// The moment the windows are read against.
  final DateTime now;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final seller = basket.seller;
    final photo = seller.photo;
    final (:from, :until) = windowOf(basket, now);

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: scheme.outlineVariant),
        borderRadius: BorderRadius.circular(RadiusTokens.lg),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Row(
              spacing: 10,
              children: [
                AppSellerAvatar(
                  name: seller.name,
                  seed: seller.id,
                  photo: photo == null
                      ? null
                      : NetworkImage(photoUri(photo.smallPath).toString()),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 2,
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
                        l10n.cartSellerWindow(seller.address, from, until),
                        style: text.label.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () => launchUrl(
                    directionsUri(basket.collectionPoint),
                    mode: LaunchMode.externalApplication,
                  ),
                  style: TextButton.styleFrom(
                    foregroundColor: context.appColors.link,
                    textStyle: text.labelStrong,
                    minimumSize: const Size(44, 44),
                  ),
                  child: Text(l10n.cartDirections),
                ),
              ],
            ),
            const Divider(height: 1),
            for (final line in basket.lines)
              LineRow(line: line, over: isOver(line, now)),
          ],
        ),
      ),
    );
  }
}

/// When the basket's dishes can be collected, from those still open; from
/// all of them once every window has closed, as the web's `useWindow`.
({String from, String until}) windowOf(Basket basket, DateTime now) {
  final open = basket.lines.where((line) => !isOver(line, now)).toList();
  final (:windowStart, :windowEnd) = collectionWindow(
    open.isEmpty ? basket : basket.copyWith(lines: open),
  );
  return (from: formatTime(windowStart), until: formatTime(windowEnd));
}

/// {@template line_row}
/// A dish of the cart (Figma K5 "món"): its photograph, the dish over what
/// its portions cost, and its − and +; at one portion − takes it out. Once
/// its window has closed, "Hết giờ nhận" and a red bin, as the web's
/// `LineRow`.
/// {@endtemplate}
class LineRow extends ConsumerWidget {
  /// {@macro line_row}
  const new({required this.line, required this.over, super.key});

  /// The dish.
  final CartLine line;

  /// Whether its window has closed.
  final bool over;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final cart = ref.read(keptCartProvider.notifier);
    final photo = line.photo;

    return Row(
      spacing: SpacingTokens.space3,
      children: [
        Opacity(
          opacity: over ? 0.5 : 1,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(RadiusTokens.md),
            child: SizedBox.square(
              dimension: 52,
              child: photo == null
                  ? ColoredBox(color: scheme.secondary)
                  : Image.network(
                      photoUri(photo.smallPath).toString(),
                      fit: BoxFit.cover,
                      excludeFromSemantics: true,
                      errorBuilder: (_, _, _) =>
                          ColoredBox(color: scheme.secondary),
                    ),
            ),
          ),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 2,
            children: [
              Text(
                line.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: text.bodySm.copyWith(
                  color: over ? scheme.onSurfaceVariant : scheme.onSurface,
                ),
              ),
              if (over)
                Text(
                  l10n.cartOver,
                  style: text.labelStrong.copyWith(color: scheme.error),
                )
              else
                Text(
                  formatPrice(line.quantity * line.priceVnd),
                  style: text.price,
                ),
            ],
          ),
        ),
        if (over)
          IconButton(
            onPressed: () => cart.removeLine(line.id),
            tooltip: l10n.cartDropLabel(line.name),
            icon: Icon(LucideIcons.trash2, color: scheme.error),
          )
        else
          AppQuantityStepper(
            quantity: line.quantity,
            addLabel: l10n.cartAdd(line.name),
            removeLabel: l10n.cartRemove(line.name),
            quantityLabel: l10n.cartQuantity(line.quantity, line.name),
            onAdd: line.quantity < line.unitsLeft
                ? () => cart.oneMore(line.id)
                : null,
            onRemove: () => cart.removeOne(line.id),
          ),
      ],
    );
  }
}

/// {@template payment_choice}
/// How to pay (Figma K5): at the counter, chosen, the only way in the
/// pilot; a bank transfer is shown but cannot be chosen until it arrives
/// (SEC-18). Nothing about it is sent with the order.
/// {@endtemplate}
class PaymentChoice extends StatelessWidget {
  /// {@macro payment_choice}
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return RadioGroup<String>(
      groupValue: 'counter',
      onChanged: (_) {},
      child: Column(
        children: [
          RadioListTile<String>(
            value: 'counter',
            contentPadding: EdgeInsets.zero,
            title: Text(l10n.cartCounter, style: text.body),
          ),
          RadioListTile<String>(
            value: 'transfer',
            enabled: false,
            contentPadding: EdgeInsets.zero,
            title: Text(
              '${l10n.cartTransfer} ${l10n.cartSoon}',
              style: text.body,
            ),
          ),
        ],
      ),
    );
  }
}
