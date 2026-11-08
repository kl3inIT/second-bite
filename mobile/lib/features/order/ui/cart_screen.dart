import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/domain/contact.dart';
import 'package:second_bite/features/order/ui/checkout_parts.dart';
import 'package:second_bite/features/order/ui/contact_sheet.dart';
import 'package:second_bite/features/order/ui/gone_sheet.dart';
import 'package:second_bite/features/order/ui/place_cart.dart';
import 'package:second_bite/features/order/ui/promotion_notice.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template cart_screen}
/// The cart's confirmation at `/cart` (Figma K5), as the web's `Checkout`
/// on a phone: one card per store's order with where and when to collect
/// and its dishes, each with its − and +; how to pay at the counter; the
/// totals and the promotions running; the cancellation policy; and "Đặt
/// món" ("Đặt 2 đơn" for two stores), which asks who collects, checks the
/// number once, then orders each store's dishes (SEC-204 › design 4). A
/// dish someone else took first asks what to do with the rest. Once every
/// order is placed, the page says which, until the order's page arrives in
/// the app (SEC-204 step 9).
/// {@endtemplate}
class CartScreen extends ConsumerStatefulWidget {
  /// {@macro cart_screen}
  const new({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  // Who collects, once confirmed, so the rest after a sold-out dish is
  // ordered for them without asking again.
  Contact? _contact;

  void _back() {
    if (context.canPop()) {
      context.pop();
    } else {
      const HomeRoute().go(context);
    }
  }

  Future<void> _order(Cart live) async {
    final contact = await askContact(context, ref);
    if (contact == null || !mounted) return;
    _contact = contact;
    await ref.read(placeCartProvider.notifier).place(live, contact);
  }

  Future<void> _showGone(Cart cart, PlaceGone gone) async {
    final choice = await showModalBottomSheet<GoneChoice>(
      context: context,
      showDragHandle: true,
      builder: (_) => GoneSheet(cut: gone.cut, rest: gone.rest),
    );
    if (!mounted) return;
    // Whatever was chosen, and on closing, the cart keeps only what is left.
    final keptCart = ref.read(keptCartProvider.notifier);
    final place = ref.read(placeCartProvider.notifier)..dismiss();
    await keptCart.setBasket(gone.sellerId, gone.rest);
    if (!mounted) return;
    switch (choice) {
      case GoneChoice.orderRest:
        final next = await ref.read(keptCartProvider.future);
        final contact = _contact;
        final ordered = next == null ? null : orderable(next, DateTime.now());
        if (ordered != null && contact != null) {
          await place.place(ordered, contact);
        }
      case GoneChoice.otherDishes:
        if (mounted) SellerRoute(id: gone.sellerId).go(context);
      case null:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final cart = ref.watch(keptCartProvider).value;
    final placing = ref.watch(placeCartProvider);
    final now = ref.watch(cartNowProvider).value ?? DateTime.now();
    ref.listen(placeCartProvider.select((state) => state.problem), (_, next) {
      if (next is PlaceGone && cart != null) unawaited(_showGone(cart, next));
    });
    final placedAll =
        placing.placed.isNotEmpty &&
        !placing.pending &&
        placing.problem == null;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: _back,
          tooltip: l10n.topBarBack,
          icon: const Icon(LucideIcons.chevronLeft),
        ),
        title: Text(l10n.cartTitle),
      ),
      body: placedAll
          ? _Placed(orders: placing.placed)
          : cart == null
          ? const _Empty()
          : _Confirmation(cart: cart, now: now),
      bottomNavigationBar: placedAll || cart == null
          ? null
          : _OrderBar(
              live: orderable(cart, now),
              placing: placing,
              onOrder: _order,
            ),
    );
  }
}

/// Nothing in the cart, and the way to tonight's dishes.
class _Empty extends StatelessWidget {
  const new();

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: SpacingTokens.space4,
          children: [
            Text(l10n.cartEmpty, style: context.appTextStyles.title),
            AppButton(
              variant: AppButtonVariant.secondary,
              onPressed: () => const HomeRoute().go(context),
              child: Text(l10n.cartBrowse),
            ),
          ],
        ),
      ),
    );
  }
}

/// The cards, payment, the summary and the policy in one column.
class _Confirmation extends StatelessWidget {
  const new({required this.cart, required this.now});

  final Cart cart;
  final DateTime now;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final live = orderable(cart, now);
    final (:units, :priceVnd, originalPriceVnd: _) = totalsOf(
      live?.lines ?? const [],
    );
    final orders = live?.baskets.length ?? 0;

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        SpacingTokens.space4,
        SpacingTokens.space4,
        SpacingTokens.space4,
        SpacingTokens.space6,
      ),
      children: [
        for (final basket in cart.baskets) ...[
          SellerOrder(basket: basket, now: now),
          const SizedBox(height: 20),
        ],
        _Heading(l10n.cartPay),
        const PaymentChoice(),
        const SizedBox(height: 20),
        _Heading(l10n.cartSummaryTitle(orders)),
        const SizedBox(height: SpacingTokens.space3),
        _SumLine(
          label: Text(l10n.cartDishes(units), style: text.bodySm),
          value: Text(formatPrice(priceVnd), style: text.price),
        ),
        const SizedBox(height: SpacingTokens.space3),
        _SumLine(
          label: Text(l10n.cartTotal, style: text.title),
          value: Text(formatPrice(priceVnd), style: text.priceLg),
        ),
        const SizedBox(height: SpacingTokens.space3),
        PromotionNotice(
          sellerIds: [
            for (final basket in live?.baskets ?? const <Basket>[])
              basket.seller.id,
          ],
        ),
        const SizedBox(height: 20),
        Semantics(
          header: true,
          child: Text(
            l10n.cartCancelTitle.toUpperCase(),
            style: text.labelStrong.copyWith(color: scheme.onSurfaceVariant),
          ),
        ),
        const SizedBox(height: SpacingTokens.space1),
        Text(
          l10n.cartCancelBody,
          style: text.label.copyWith(color: scheme.onSurfaceVariant),
        ),
      ],
    );
  }
}

class _Heading extends StatelessWidget {
  const new(this.title);

  final String title;

  @override
  Widget build(BuildContext context) => Semantics(
    header: true,
    child: Text(title, style: context.appTextStyles.title),
  );
}

class _SumLine extends StatelessWidget {
  const new({required this.label, required this.value});

  final Widget label;
  final Widget value;

  @override
  Widget build(BuildContext context) => Row(
    spacing: SpacingTokens.space3,
    children: [
      Expanded(child: label),
      value,
    ],
  );
}

/// The bar at the foot: the totals, "Đặt món", and why the last attempt
/// failed in the server's words.
class _OrderBar extends StatelessWidget {
  const new({required this.live, required this.placing, required this.onOrder});

  final Cart? live;
  final PlaceState placing;
  final ValueChanged<Cart> onOrder;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final live = this.live;
    final (:units, :priceVnd, :originalPriceVnd) = totalsOf(
      live?.lines ?? const [],
    );
    final orders = live?.baskets.length ?? 0;
    final original = formatPrice(originalPriceVnd);
    final failed = placing.problem;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (failed is PlaceFailed) _Failed(failed),
        AppCartBar(
          price: formatPrice(priceVnd),
          originalPrice: original,
          originalPriceLabel: l10n.offerOriginalPrice(original),
          summary: l10n.cartTotalSummary(
            orders,
            units,
            formatPrice(originalPriceVnd - priceVnd),
          ),
          action: AppButton(
            onPressed: placing.pending || live == null
                ? null
                : () => onOrder(live),
            icon: placing.pending
                ? const SizedBox.square(
                    dimension: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : null,
            child: Text(l10n.cartOrder(orders < 1 ? 1 : orders)),
          ),
        ),
      ],
    );
  }
}

/// The server's words for a refusal, with the request's reference, or the
/// page's own without an answer: the limits of SEC-158 among them.
class _Failed extends StatelessWidget {
  const new(this.failed);

  final PlaceFailed failed;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final reference = failed.reference;
    final detail = failed.detail;

    return Padding(
      padding: const EdgeInsets.fromLTRB(
        SpacingTokens.space4,
        SpacingTokens.space3,
        SpacingTokens.space4,
        0,
      ),
      child: AppAlert(
        icon: LucideIcons.circleAlert,
        title: detail == null || detail.isEmpty
            ? l10n.cartOrderFailedPlain
            : detail,
        description: reference == null ? '' : l10n.problemReference(reference),
      ),
    );
  }
}

/// The orders just placed: their numbers, stores, windows and what to pay
/// at the counter.
class _Placed extends StatelessWidget {
  const new({required this.orders});

  final List<OrderBody> orders;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return ListView(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      children: [
        Semantics(
          header: true,
          liveRegion: true,
          child: Text(
            l10n.cartPlacedTitle(orders.length),
            style: text.headline,
          ),
        ),
        const SizedBox(height: SpacingTokens.space2),
        Text(
          l10n.cartPlacedHint,
          style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
        ),
        const SizedBox(height: SpacingTokens.space4),
        for (final order in orders)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 2,
                children: [
                  Text(
                    l10n.cartPlacedLine(order.number, order.seller.name),
                    style: text.title,
                  ),
                  Text(
                    l10n.cartPlacedWindow(
                      formatTime(order.windowStart),
                      formatTime(order.windowEnd),
                      formatPrice(order.payVnd),
                    ),
                    style: text.label.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: SpacingTokens.space4),
        AppButton(
          variant: AppButtonVariant.secondary,
          onPressed: () => const HomeRoute().go(context),
          child: Text(l10n.cartBrowse),
        ),
      ],
    );
  }
}
