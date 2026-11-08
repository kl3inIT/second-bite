import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template orders_screen}
/// "Đơn của tôi" at `/orders` (Figma K8, D6), as the web's `MyOrders` on a
/// phone: the two lists as a segmented control; each order still to
/// collect as a card with the way to it; the ended ones under their day.
/// The account's orders when signed in, those placed on this phone
/// otherwise, and a prompt to sign in when there are neither. Pulled down,
/// they are read again, as they are when the app comes back and when an
/// order's window ends (SEC-204 › design 5, until the live socket).
/// {@endtemplate}
class OrdersScreen extends ConsumerWidget {
  /// {@macro orders_screen}
  const new({required this.ended, super.key});

  /// Whether the ended orders are shown, rather than those to collect.
  final bool ended;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final orders = ref.watch(myOrdersProvider);
    Future<void> reload() => ref.refresh(myOrdersProvider.future);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.ordersTitle)),
      body: switch (orders) {
        AsyncData(value: null) => const OrdersSignInPrompt(returnTo: '/orders'),
        AsyncData(value: final MyOrders lists) => OrderRefresh(
          moments: [for (final order in lists.open) order.windowEnd],
          onRefresh: () => ref.invalidate(myOrdersProvider),
          child: RefreshIndicator(
            onRefresh: reload,
            child: _Lists(lists: lists, ended: ended),
          ),
        ),
        AsyncError(:final error) => OrderFailure(
          error: error,
          onRetry: () => ref.invalidate(myOrdersProvider),
        ),
        _ => const Center(child: CircularProgressIndicator()),
      },
    );
  }
}

class _Lists extends StatelessWidget {
  const new({required this.lists, required this.ended});

  final MyOrders lists;
  final bool ended;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final now = DateTime.now();
    final days = [
      for (final day in OrderDay.values)
        (
          day: day,
          orders: [
            for (final order in lists.ended)
              if (dayOf(order.windowStart, now) == day) order,
          ],
        ),
    ].where((group) => group.orders.isNotEmpty).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        SpacingTokens.space4,
        SpacingTokens.space3,
        SpacingTokens.space4,
        SpacingTokens.space6 * 3,
      ),
      children: [
        _Tabs(ended: ended, openCount: lists.open.length),
        const SizedBox(height: SpacingTokens.space4),
        if (!ended)
          if (lists.open.isEmpty)
            _None(l10n.ordersNoneOpen)
          else
            for (final order in lists.open) ...[
              _OpenOrderCard(order: order),
              const SizedBox(height: SpacingTokens.space4),
            ]
        else if (days.isEmpty)
          _None(l10n.ordersNoneEnded)
        else
          for (final group in days) ...[
            Semantics(
              header: true,
              child: Text(switch (group.day) {
                OrderDay.today => l10n.ordersDayToday,
                OrderDay.week => l10n.ordersDayWeek,
                OrderDay.before => l10n.ordersDayBefore,
              }, style: context.appTextStyles.title),
            ),
            const SizedBox(height: 10),
            for (final order in group.orders) ...[
              _EndedOrderRow(order: order),
              const SizedBox(height: 10),
            ],
            const SizedBox(height: SpacingTokens.space2),
          ],
      ],
    );
  }
}

/// The two lists as a segmented control.
class _Tabs extends StatelessWidget {
  const new({required this.ended, required this.openCount});

  final bool ended;
  final int openCount;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final scheme = Theme.of(context).colorScheme;
    final text = context.appTextStyles;

    Widget tab({
      required String label,
      required bool current,
      required VoidCallback onTap,
    }) => Expanded(
      child: Semantics(
        selected: current,
        button: true,
        child: Material(
          color: current ? scheme.surface : Colors.transparent,
          borderRadius: BorderRadius.circular(RadiusTokens.md),
          child: InkWell(
            borderRadius: BorderRadius.circular(RadiusTokens.md),
            onTap: onTap,
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 44),
              child: Center(
                child: Text(
                  label,
                  style: current
                      ? text.bodySmStrong.copyWith(color: scheme.primary)
                      : text.bodySm.copyWith(color: scheme.onSurfaceVariant),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    return Semantics(
      container: true,
      label: l10n.ordersLists,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.secondaryContainer,
          borderRadius: BorderRadius.circular(RadiusTokens.lg),
        ),
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space1),
          child: Row(
            children: [
              tab(
                label: l10n.ordersTabOpen(openCount),
                current: !ended,
                onTap: () => const OrdersRoute().go(context),
              ),
              tab(
                label: l10n.ordersTabEnded,
                current: ended,
                onTap: () => const OrdersRoute(state: 'ended').go(context),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _None extends StatelessWidget {
  const new(this.message);

  final String message;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(SpacingTokens.space6),
      child: Text(
        message,
        textAlign: TextAlign.center,
        style: context.appTextStyles.bodySm.copyWith(
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    ),
  );
}

/// A store's order still to collect, with the way to it (Figma K8 ›
/// active): the store and when to collect, the dishes, the number, what to
/// pay, and the button to its page.
class _OpenOrderCard extends StatelessWidget {
  const new({required this.order});

  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final ready = order.status == OrderBodyStatus.ready;
    final from = formatTime(order.windowStart);
    final until = formatTime(order.windowEnd);
    final total = formatPrice(order.payVnd);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          const PositionedDirectional(
            top: 0,
            end: 0,
            child: AppBiteCorner(size: 48),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space3,
              children: [
                Row(
                  spacing: SpacingTokens.space3,
                  children: [
                    OrderThumb(order: order, size: 72),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: SpacingTokens.space1,
                        children: [
                          Padding(
                            padding: const EdgeInsetsDirectional.only(end: 24),
                            child: Row(
                              spacing: SpacingTokens.space2,
                              children: [
                                Expanded(
                                  child: Text(
                                    order.seller.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: text.label.copyWith(
                                      color: scheme.onSurfaceVariant,
                                    ),
                                  ),
                                ),
                                if (ready)
                                  AppStatusPill(
                                    label: l10n.ordersReadyUntil(until),
                                  )
                                else
                                  Text(
                                    l10n.ordersPreparing,
                                    style: text.labelStrong.copyWith(
                                      color: scheme.primary,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          Text(
                            dishesOf(order),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: text.title,
                          ),
                          Text(
                            ready
                                ? l10n.ordersCardMetaReady(order.number, total)
                                : l10n.ordersCardMetaWindow(
                                    order.number,
                                    total,
                                    from,
                                    until,
                                  ),
                            style: text.label.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                AppButton(
                  variant: AppButtonVariant.secondary,
                  onPressed: () => OrderRoute(orderId: order.id).go(context),
                  child: Text(ready ? l10n.ordersSeeQr : l10n.ordersSeeOrder),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// A store's order that ended, on one line (Figma K8 › past): its day,
/// what became of it and what it cost.
class _EndedOrderRow extends StatelessWidget {
  const new({required this.order});

  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;
    final collected = order.status == OrderBodyStatus.collected;
    final (:day, :month) = dayMonthOf(order.windowStart);
    final meta = [
      if (collected) order.seller.name,
      l10n.ordersDate(day, month),
      endedLineOf(l10n, order.status),
      if (collected) formatPrice(order.payVnd),
    ].join(' · ');
    final tone = switch (order.status) {
      OrderBodyStatus.cancelled || OrderBodyStatus.refused => scheme.error,
      OrderBodyStatus.expired => colors.warningForeground,
      _ => scheme.onSurfaceVariant,
    };

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => OrderRoute(orderId: order.id).go(context),
        child: Padding(
          padding: const EdgeInsets.all(SpacingTokens.space3),
          child: Row(
            spacing: SpacingTokens.space3,
            children: [
              OrderThumb(order: order, size: 52),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 2,
                  children: [
                    Text(
                      dishesOf(order),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: text.bodySmStrong,
                    ),
                    Text(meta, style: text.label.copyWith(color: tone)),
                  ],
                ),
              ),
              Icon(
                LucideIcons.chevronRight,
                size: 18,
                color: scheme.onSurfaceVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// What became of an order, on its row in the ended list.
String endedLineOf(AppLocalizations l10n, OrderBodyStatus status) =>
    switch (status) {
      OrderBodyStatus.confirmed => l10n.ordersEndedLineConfirmed,
      OrderBodyStatus.ready => l10n.ordersEndedLineReady,
      OrderBodyStatus.collected => l10n.ordersEndedLineCollected,
      OrderBodyStatus.cancelled => l10n.ordersEndedLineCancelled,
      OrderBodyStatus.refused => l10n.ordersEndedLineRefused,
      OrderBodyStatus.expired => l10n.ordersEndedLineExpired,
      _ => '',
    };
