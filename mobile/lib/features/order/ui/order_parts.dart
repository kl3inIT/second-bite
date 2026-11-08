import 'package:app_ui/app_ui.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:url_launcher/url_launcher.dart';

// The pieces the order screens are built from, as the web's
// web/src/features/orders/order-parts.tsx on a phone (Figma K6, K6b, D5):
// the store's row, the ticket with its QR, the orders placed together, the
// dishes and totals, the way to the counter and how to collect.

/// "20/10", the day of [moment], in both languages.
String orderDate(AppLocalizations l10n, DateTime moment) {
  final (:day, :month) = dayMonthOf(moment);
  return l10n.ordersDate(day, month);
}

/// "1 giờ 12 phút", or "48 phút".
String spanText(AppLocalizations l10n, Duration span) {
  final (:hours, :minutes) = hoursAndMinutes(span);
  return hours > 0
      ? l10n.orderHoursMinutes(hours, minutes)
      : l10n.orderMinutes(minutes);
}

/// The way to the store's counter in Google Maps.
Uri orderDirectionsUri(OrderSellerBody seller) => Uri.https(
  'www.google.com',
  '/maps/dir/',
  {'api': '1', 'destination': '${seller.latitude},${seller.longitude}'},
);

/// {@template order_thumb}
/// An order's first dish, square, or the muted ground without a photo.
/// {@endtemplate}
class OrderThumb extends StatelessWidget {
  /// {@macro order_thumb}
  const new({required this.order, required this.size, super.key});

  /// The order.
  final OrderBody order;

  /// Its side.
  final double size;

  @override
  Widget build(BuildContext context) =>
      _Photo(path: order.lines.firstOrNull?.photo.smallPath, size: size);
}

class _Photo extends StatelessWidget {
  const new({required this.path, required this.size, this.round = false});

  final String? path;
  final double size;
  final bool round;

  @override
  Widget build(BuildContext context) {
    final path = this.path;
    return Container(
      width: size,
      height: size,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceDim,
        shape: round ? BoxShape.circle : BoxShape.rectangle,
        borderRadius: round
            ? null
            : BorderRadius.circular(
                size > 48 ? RadiusTokens.sm : RadiusTokens.xs + 2,
              ),
      ),
      child: path == null
          ? null
          : Image.network(
              photoUri(path).toString(),
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => const SizedBox.shrink(),
            ),
    );
  }
}

/// {@template orders_sign_in_prompt}
/// No one is signed in and this phone placed no such order: the way to
/// sign in, and back to [returnTo] afterwards.
/// {@endtemplate}
class OrdersSignInPrompt extends StatelessWidget {
  /// {@macro orders_sign_in_prompt}
  const new({required this.returnTo, super.key});

  /// Where signing in returns to.
  final String returnTo;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;

    return ListView(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(SpacingTokens.space6),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space3,
              children: [
                Semantics(
                  header: true,
                  child: Text(l10n.ordersSignInTitle, style: text.headline),
                ),
                Text(
                  l10n.ordersSignInBody,
                  style: text.bodySm.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
                ),
                AppButton(
                  onPressed: () => SignInRoute(returnTo: returnTo).go(context),
                  child: Text(l10n.accountSignIn),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

/// {@template order_failure}
/// Orders that could not be read: the server's words when it gave some,
/// its reference, and a retry.
/// {@endtemplate}
class OrderFailure extends StatelessWidget {
  /// {@macro order_failure}
  const new({required this.error, required this.onRetry, super.key});

  /// What failed.
  final Object error;

  /// Reads again.
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final problem = problemOf(error);
    final reference = problem?.requestId;

    return ListView(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(SpacingTokens.space6),
            child: Semantics(
              liveRegion: true,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: SpacingTokens.space4,
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
                  FilledButton(
                    onPressed: onRetry,
                    child: Text(l10n.errorRetry),
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

/// {@template order_seller_row}
/// The store, its counter and the window today, and how many portions the
/// order holds (Figma D2 › store).
/// {@endtemplate}
class OrderSellerRow extends StatelessWidget {
  /// {@macro order_seller_row}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Row(
      spacing: SpacingTokens.space3,
      children: [
        _Photo(
          path: order.lines.firstOrNull?.photo.smallPath,
          size: 40,
          round: true,
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                order.seller.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: text.title,
              ),
              Text(
                l10n.orderCounterToday(
                  order.seller.address,
                  formatTime(order.windowStart),
                  formatTime(order.windowEnd),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: text.label.copyWith(color: scheme.onSurfaceVariant),
              ),
            ],
          ),
        ),
        Text(
          l10n.orderUnits(unitsOf(order)),
          style: text.bodySmStrong.copyWith(color: scheme.primary),
        ),
      ],
    );
  }
}

/// {@template order_ticket}
/// The ticket of an open order (Figma K6): the store above a torn edge,
/// then the order's QR code once it is ready, or a pale one until then,
/// beside how to collect it: the code, or the name and phone number read
/// out (SEC-86); under them the other stores' orders placed with it.
/// {@endtemplate}
class OrderTicket extends StatelessWidget {
  /// {@macro order_ticket}
  const new({required this.order, required this.together, super.key});

  /// The order.
  final OrderBody order;

  /// The other stores' orders placed with it.
  final List<OrderBody> together;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final ready = order.status == OrderBodyStatus.ready;

    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(RadiusTokens.radius3xl),
      ),
      child: Stack(
        children: [
          const PositionedDirectional(
            top: 0,
            end: 0,
            child: AppBiteCorner(size: 64),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 14,
              children: [
                OrderSellerRow(order: order),
                Divider(color: scheme.outlineVariant, height: 1),
                Row(
                  spacing: 20,
                  children: [
                    if (ready)
                      Semantics(
                        label: l10n.orderQrLabel(order.number),
                        image: true,
                        child: ColoredBox(
                          color: Colors.white,
                          child: QrImageView(
                            data: order.id,
                            size: 120,
                            padding: const EdgeInsets.all(6),
                          ),
                        ),
                      )
                    else
                      ExcludeSemantics(
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: scheme.surfaceDim,
                            borderRadius: BorderRadius.circular(
                              RadiusTokens.md,
                            ),
                          ),
                          child: Icon(
                            LucideIcons.qrCode,
                            size: 80,
                            color: scheme.outlineVariant,
                          ),
                        ),
                      ),
                    Expanded(
                      child: Text(
                        ready ? l10n.orderCollectReady : l10n.orderCollectLater,
                        style: text.bodySm.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
                OrderTogetherLinks(together: together),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// {@template order_together_links}
/// "Cùng lần đặt: Panda Chef ›", a link to each other store's order placed
/// from the same cart (SEC-97 › decision 4).
/// {@endtemplate}
class OrderTogetherLinks extends StatelessWidget {
  /// {@macro order_together_links}
  const new({required this.together, super.key});

  /// The other stores' orders.
  final List<OrderBody> together;

  @override
  Widget build(BuildContext context) {
    if (together.isEmpty) return const SizedBox.shrink();
    final l10n = context.l10n;
    final link = context.appColors.link;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final other in together)
          TextButton.icon(
            onPressed: () => OrderRoute(orderId: other.id).go(context),
            iconAlignment: IconAlignment.end,
            icon: Icon(LucideIcons.chevronRight, size: 16, color: link),
            label: Text(
              l10n.orderPlacedWith(other.seller.name),
              style: context.appTextStyles.labelStrong.copyWith(color: link),
            ),
          ),
      ],
    );
  }
}

/// {@template order_how_to_collect}
/// The steps of collecting an order (Figma D3 › Cách nhận món): three round
/// icons in a row, joined by dashed lines.
/// {@endtemplate}
class OrderHowToCollect extends StatelessWidget {
  /// {@macro order_how_to_collect}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final steps = [
      (LucideIcons.mapPin, l10n.orderHowGoTitle, order.seller.address),
      (LucideIcons.qrCode, l10n.orderHowQrTitle, l10n.orderHowQrBody),
      (LucideIcons.shoppingBag, l10n.orderHowTakeTitle, l10n.orderHowTakeBody),
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.orderHowTitle, style: text.title),
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final (index, (icon, title, body)) in steps.indexed) ...[
                  if (index > 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 18),
                      child: SizedBox(
                        width: 16,
                        child: Divider(
                          thickness: 2,
                          color: context.appColors.secondaryHover,
                        ),
                      ),
                    ),
                  Expanded(
                    child: Column(
                      spacing: 6,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: scheme.surfaceDim,
                          ),
                          child: Icon(icon, size: 16, color: scheme.primary),
                        ),
                        Text(
                          title,
                          textAlign: TextAlign.center,
                          style: text.labelStrong,
                        ),
                        Text(
                          body,
                          textAlign: TextAlign.center,
                          style: text.label.copyWith(
                            color: scheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// {@template order_summary}
/// What was ordered and what it came to (Figma D2 › món trong đơn): each
/// line with its photograph, price and original price, the promotion's
/// discount, then the saving and the total, the number and how it is paid.
/// {@endtemplate}
class OrderSummary extends StatelessWidget {
  /// {@macro order_summary}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;
    final paid = isOpen(order) || order.status == OrderBodyStatus.collected;
    final discounted = order.discountVnd > 0;
    final promotion = order.promotion;
    final muted = text.label.copyWith(color: scheme.onSurfaceVariant);
    final struck = muted.copyWith(decoration: TextDecoration.lineThrough);
    Widget fact(String label, Widget value, {bool end = false}) => Column(
      crossAxisAlignment: end
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
      spacing: 2,
      children: [
        Text(
          label.toUpperCase(),
          style: text.labelStrong.copyWith(color: scheme.onSurfaceVariant),
        ),
        value,
      ],
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 14,
      children: [
        Semantics(
          header: true,
          child: Text(
            l10n.orderOrdered(unitsOf(order)).toUpperCase(),
            style: text.labelStrong.copyWith(color: scheme.onSurfaceVariant),
          ),
        ),
        for (final line in order.lines)
          Row(
            spacing: 10,
            children: [
              SizedBox(
                width: 22,
                child: Text('${line.units}×', style: text.price),
              ),
              _Photo(path: line.photo.smallPath, size: 36),
              Expanded(
                child: Text(
                  line.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: text.bodySm,
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    formatPrice(line.priceVnd * line.units),
                    style: text.price.copyWith(color: scheme.primary),
                  ),
                  Semantics(
                    label:
                        '${l10n.orderOriginalPrice} '
                        '${formatPrice(line.originalPriceVnd * line.units)}',
                    excludeSemantics: true,
                    child: Text(
                      formatPrice(line.originalPriceVnd * line.units),
                      style: struck,
                    ),
                  ),
                ],
              ),
            ],
          ),
        if (discounted && promotion != null)
          DecoratedBox(
            decoration: BoxDecoration(
              color: colors.freshMuted,
              borderRadius: BorderRadius.circular(RadiusTokens.md),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: SpacingTokens.space3,
                vertical: 10,
              ),
              child: Row(
                spacing: SpacingTokens.space2,
                children: [
                  Icon(
                    LucideIcons.gift,
                    size: 16,
                    color: colors.freshForeground,
                  ),
                  Expanded(
                    child: Text(
                      l10n.orderFactDiscount(promotion.name, promotion.rule),
                      style: text.bodySm.copyWith(
                        color: colors.freshForeground,
                      ),
                    ),
                  ),
                  Text(
                    '−${formatPrice(order.discountVnd)}',
                    style: text.price.copyWith(color: colors.deal),
                  ),
                ],
              ),
            ),
          ),
        Divider(color: scheme.outlineVariant, height: 1),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space4,
          children: [
            Flexible(
              child: fact(
                l10n.orderFactSaved,
                Text(
                  l10n.orderFactSavedValue(formatPrice(savingOf(order))),
                  style: text.bodySm,
                ),
              ),
            ),
            fact(
              discounted ? l10n.orderFactPayAtCounter : l10n.orderFactTotal,
              Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                spacing: 6,
                children: [
                  if (discounted)
                    Semantics(
                      label:
                          '${l10n.orderFactBeforeDiscount} '
                          '${formatPrice(order.totalVnd)}',
                      excludeSemantics: true,
                      child: Text(formatPrice(order.totalVnd), style: struck),
                    ),
                  Text(formatPrice(order.payVnd), style: text.price),
                ],
              ),
              end: true,
            ),
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          spacing: SpacingTokens.space4,
          children: [
            fact(
              l10n.orderFactNumber,
              Text('#${order.number}', softWrap: false, style: text.bodySm),
            ),
            Flexible(
              child: fact(
                l10n.orderFactPayment,
                Text(
                  paid ? l10n.orderFactAtCounter : l10n.orderFactNothing,
                  textAlign: TextAlign.end,
                  style: text.bodySm,
                ),
                end: true,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

/// {@template order_directions}
/// Where the counter is: the store and its counter, and the way there in
/// the phone's maps (Figma D2 › chỗ nhận). The store's map waits for the
/// map's style as a file (SEC-204 step 4); "Nhắn quán" for the chat (step
/// 12).
/// {@endtemplate}
class OrderDirections extends StatelessWidget {
  /// {@macro order_directions}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Semantics(
      container: true,
      label: l10n.orderDirectionsLabel,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: SpacingTokens.space3,
            children: [
              Text(
                l10n.orderPlaceLine(order.seller.name, order.seller.address),
                style: context.appTextStyles.bodySmStrong,
              ),
              AppButton(
                onPressed: () => launchUrl(
                  orderDirectionsUri(order.seller),
                  mode: LaunchMode.externalApplication,
                ),
                child: Text(l10n.orderDirections),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
