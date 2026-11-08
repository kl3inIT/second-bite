import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/not_found_screen.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/features/order/ui/order_actions.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/l10n/l10n.dart';

/// {@template order_screen}
/// An order's page at `/orders/:orderId` (Figma K6, K6b, D2–D5), as the
/// web's `OrderView` on a phone. An order still to collect leads with the
/// blue band: the window in large figures, how long until it opens or
/// closes, the steps; then the ticket with the QR once ready, how to
/// collect, the dishes and totals, the way to the counter and cancelling.
/// A collected order leads with what it saved and asks for a rating; a
/// rated one, and one that ended otherwise, shows as a receipt in the
/// colour of what became of it, with what happened. It is read again when
/// pulled down, when the app comes back and as its window opens and closes
/// (SEC-204 › design 5, until the live socket).
/// {@endtemplate}
class OrderScreen extends ConsumerStatefulWidget {
  /// {@macro order_screen}
  const new({required this.orderId, super.key});

  /// The order.
  final String orderId;

  @override
  ConsumerState<OrderScreen> createState() => _OrderScreenState();
}

class _OrderScreenState extends ConsumerState<OrderScreen> {
  // "còn 1 giờ 12 phút" counts down with the minutes.
  late final Timer _tick;

  @override
  void initState() {
    super.initState();
    _tick = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _tick.cancel();
    super.dispose();
  }

  void _back() {
    if (context.canPop()) {
      context.pop();
    } else {
      const OrdersRoute().go(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final view = ref.watch(orderViewProvider(widget.orderId));
    void reload() => ref.invalidate(orderViewProvider(widget.orderId));

    Widget barred(Widget body) => Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: _back,
          tooltip: l10n.topBarBack,
          icon: const Icon(LucideIcons.chevronLeft),
        ),
        title: Text(l10n.ordersTitle),
      ),
      body: body,
    );

    return switch (view) {
      AsyncData(value: null) => const NotFoundScreen(),
      AsyncData(value: final OrderView found) => OrderRefresh(
        moments: [found.order.windowStart, found.order.windowEnd],
        onRefresh: reload,
        child: _OrderPage(view: found, onBack: _back, now: DateTime.now()),
      ),
      AsyncError(error: OrderUnknown()) => barred(
        OrdersSignInPrompt(returnTo: '/orders/${widget.orderId}'),
      ),
      AsyncError(:final error) => barred(
        OrderFailure(error: error, onRetry: reload),
      ),
      _ => barred(const Center(child: CircularProgressIndicator())),
    };
  }
}

class _OrderPage extends ConsumerWidget {
  const new({required this.view, required this.onBack, required this.now});

  final OrderView view;
  final VoidCallback onBack;
  final DateTime now;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final order = view.order;
    final l10n = context.l10n;
    final rated = order.review != null || !order.canReview;
    final open = isOpen(order);
    final band = open || (order.status == OrderBodyStatus.collected && !rated);
    final scheme = Theme.of(context).colorScheme;

    final children = switch (order.status) {
      _ when open => _openParts(context),
      OrderBodyStatus.collected when !rated => _collectedParts(context),
      _ => _receiptParts(context),
    };

    final page = RefreshIndicator(
      onRefresh: () => ref.refresh(orderViewProvider(order.id).future),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          if (band) _band(context),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              SpacingTokens.space4,
              SpacingTokens.space4,
              SpacingTokens.space4,
              SpacingTokens.space6,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: SpacingTokens.space3,
              children: children,
            ),
          ),
        ],
      ),
    );

    if (band) {
      return AnnotatedRegion<SystemUiOverlayStyle>(
        value: SystemUiOverlayStyle.light,
        child: Scaffold(body: page),
      );
    }
    return Scaffold(
      appBar: AppBar(
        backgroundColor: scheme.primary,
        foregroundColor: scheme.onPrimary,
        leading: IconButton(
          onPressed: onBack,
          tooltip: l10n.topBarBack,
          icon: const Icon(LucideIcons.chevronLeft),
        ),
        title: Text(l10n.orderNumber(order.number)),
      ),
      body: page,
    );
  }

  /// The blue band: the back button and the number, a line in lime, a large
  /// figure, a line in pale blue, then the steps.
  Widget _band(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final colors = context.appColors;
    final order = view.order;
    final collected = order.status == OrderBodyStatus.collected;
    final ready = order.status == OrderBodyStatus.ready;
    final (eyebrow, figure, line) = collected
        ? (
            l10n.orderCollectedAt(
              formatTime(order.collectedAt ?? order.windowEnd),
            ),
            formatPrice(savingOf(order)),
            l10n.orderSavedLine(unitsOf(order)),
          )
        : (
            ready ? l10n.orderHeadlineReady : l10n.orderHeadlineConfirmed,
            '${formatTime(order.windowStart)} – ${formatTime(order.windowEnd)}',
            windowPhaseOf(order, now) == WindowPhase.before
                ? l10n.orderOpensIn(
                    spanText(l10n, order.windowStart.difference(now)),
                  )
                : l10n.orderClosesIn(
                    spanText(l10n, order.windowEnd.difference(now)),
                  ),
          );

    return ColoredBox(
      color: colors.header,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(
            SpacingTokens.space2,
            0,
            SpacingTokens.space4,
            SpacingTokens.space6,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 64,
                child: Row(
                  spacing: SpacingTokens.space1,
                  children: [
                    IconButton(
                      onPressed: onBack,
                      tooltip: l10n.topBarBack,
                      color: colors.headerForeground,
                      icon: const Icon(LucideIcons.chevronLeft),
                    ),
                    Semantics(
                      header: true,
                      child: Text(
                        l10n.orderNumber(order.number),
                        style: text.barTitle.copyWith(
                          color: colors.headerForeground,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsetsDirectional.only(
                  start: SpacingTokens.space2,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: SpacingTokens.space3),
                    Text(
                      eyebrow,
                      style: text.title.copyWith(color: colors.fresh),
                    ),
                    Text(
                      figure,
                      style: text.display.copyWith(
                        color: colors.headerForeground,
                      ),
                    ),
                    const SizedBox(height: SpacingTokens.space1),
                    Text(
                      line,
                      style: text.bodySm.copyWith(color: colors.inverseMuted),
                    ),
                    const SizedBox(height: 20),
                    _steps(context),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _steps(BuildContext context) {
    final l10n = context.l10n;
    final order = view.order;
    final current = stepOf(order);
    final collected = order.status == OrderBodyStatus.collected;
    AppOrderStepState stateAt(int index) {
      if (index < current || (collected && index == current)) {
        return AppOrderStepState.done;
      }
      return index == current ? AppOrderStepState.now : AppOrderStepState.later;
    }

    return AppOrderSteps(
      label: l10n.orderStepsLabel,
      steps: [
        AppOrderStep(
          icon: LucideIcons.receiptText,
          label: l10n.orderStepPlaced,
          state: stateAt(0),
        ),
        AppOrderStep(
          icon: LucideIcons.store,
          label: l10n.orderStepPreparing,
          state: stateAt(1),
        ),
        AppOrderStep(
          icon: LucideIcons.shoppingBag,
          label: l10n.orderStepReady,
          state: stateAt(2),
        ),
        AppOrderStep(
          icon: LucideIcons.check,
          label: l10n.orderStepCollected,
          state: stateAt(3),
        ),
      ],
    );
  }

  /// An order still to collect: the ticket, how to collect once it is
  /// ready, the dishes and totals, the way to the counter, cancelling last.
  List<Widget> _openParts(BuildContext context) {
    final order = view.order;
    return [
      OrderTicket(order: order, together: view.together),
      if (order.status == OrderBodyStatus.ready)
        OrderHowToCollect(order: order),
      _card(OrderSummary(order: order)),
      OrderDirections(order: order),
      if (canCancel(order)) CancelOrder(order: order),
    ];
  }

  /// A collected order not rated yet: the rating, then the store, the
  /// orders placed with it, the dishes and the problem report.
  List<Widget> _collectedParts(BuildContext context) {
    final order = view.order;
    final scheme = Theme.of(context).colorScheme;
    return [
      if (order.canReview) ReviewForm(order: order),
      _card(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 14,
          children: [
            OrderSellerRow(order: order),
            OrderTogetherLinks(together: view.together),
            Divider(color: scheme.outlineVariant, height: 1),
            OrderSummary(order: order),
            OrderProblemSection(order: order),
          ],
        ),
      ),
    ];
  }

  /// A rated order, or one that ended without being collected, as a receipt
  /// framed in the colour of what became of it, then what happened, the way
  /// back to tonight's dishes and, last, its problem (Figma D5, O5, O6).
  List<Widget> _receiptParts(BuildContext context) {
    final l10n = context.l10n;
    final order = view.order;
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;
    final (
      IconData? icon,
      Color frame,
      Color onFrame,
      String badge,
    ) = switch (order.status) {
      OrderBodyStatus.cancelled => (
        LucideIcons.circleX,
        scheme.error,
        scheme.onError,
        l10n.orderEndedBadgeCancelled,
      ),
      OrderBodyStatus.refused => (
        LucideIcons.circleX,
        scheme.error,
        scheme.onError,
        l10n.orderEndedBadgeRefused,
      ),
      OrderBodyStatus.expired => (
        LucideIcons.clockFading,
        colors.warningBorder,
        colors.warningForeground,
        l10n.orderEndedBadgeExpired,
      ),
      _ => (
        null,
        scheme.primary,
        scheme.onPrimary,
        l10n.orderEndedAtCollected(
          formatTime(order.collectedAt ?? order.windowEnd),
          orderDate(l10n, order.collectedAt ?? order.windowEnd),
        ),
      ),
    };

    return [
      DecoratedBox(
        decoration: BoxDecoration(
          color: frame,
          borderRadius: BorderRadius.circular(RadiusTokens.radius2xl),
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(3, 0, 3, 3),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  spacing: 6,
                  children: [
                    if (icon != null) Icon(icon, size: 16, color: onFrame),
                    Flexible(
                      child: Text(
                        badge,
                        textAlign: TextAlign.center,
                        style: context.appTextStyles.bodySmStrong.copyWith(
                          color: onFrame,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(RadiusTokens.md),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(SpacingTokens.space4),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: 14,
                    children: [
                      OrderSellerRow(order: order),
                      Divider(color: scheme.outlineVariant, height: 1),
                      OrderSummary(order: order),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      if (order.review case final review?) ReviewGiven(review: review),
      OrderTimeline(order: order),
      AppButton(
        onPressed: () => const HomeRoute().go(context),
        child: Text(l10n.orderSeeOthers),
      ),
      OrderProblemSection(order: order),
    ];
  }

  Widget _card(Widget child) => Card(
    child: Padding(
      padding: const EdgeInsets.all(SpacingTokens.space4),
      child: child,
    ),
  );
}

/// {@template order_timeline}
/// What happened to an order, as a list of moments (Figma D5 › Trạng
/// thái): a cancelled or collected order its whole course, a refused or
/// expired one only what ended it, with what that means.
/// {@endtemplate}
class OrderTimeline extends StatelessWidget {
  /// {@macro order_timeline}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;
    final units = unitsOf(order);
    final total = formatPrice(order.payVnd);
    final reason = refuseReasonOf(l10n, order.refuseReason);
    final placed = (
      l10n.orderTimelinePlaced,
      l10n.orderTimelinePlacedBody(
        orderDate(l10n, order.createdAt),
        formatTime(order.createdAt),
        units,
        total,
      ),
    );
    // An order is confirmed when it is placed (docs/specs/order.md).
    final confirmed = (
      l10n.orderTimelineConfirmed,
      l10n.orderTimelineConfirmedBody(formatTime(order.createdAt), units),
    );
    final moments = <(String, String)>[
      if (order.status == OrderBodyStatus.cancelled) ...[
        placed,
        confirmed,
        if (order.cancelledAt case final at?) ...[
          (
            l10n.orderTimelineCancelled,
            switch (order.cancelReason) {
              final why? when why.isNotEmpty => l10n.orderTimelineWithReason(
                formatTime(at),
                why,
              ),
              _ => formatTime(at),
            },
          ),
          (l10n.orderTimelineReturned(units), l10n.orderTimelineReturnedBody),
        ],
      ],
      if (order.status == OrderBodyStatus.collected) ...[
        placed,
        confirmed,
        if (order.readyAt case final at?)
          (
            l10n.orderTimelineReady,
            l10n.orderTimelineReadyBody(formatTime(at)),
          ),
        (
          l10n.orderTimelineCollected,
          switch (order.review) {
            final review? => l10n.orderTimelineCollectedRated(
              formatTime(order.collectedAt ?? order.windowEnd),
              total,
              review.stars,
            ),
            null => l10n.orderTimelineCollectedBody(
              formatTime(order.collectedAt ?? order.windowEnd),
              total,
            ),
          },
        ),
      ],
      if (order.status == OrderBodyStatus.refused)
        if (order.refusedAt case final at?)
          (
            l10n.orderTimelineRefused,
            order.refuseReason == null
                ? formatTime(at)
                : l10n.orderTimelineRefusedBody(formatTime(at), reason),
          ),
      if (order.status == OrderBodyStatus.expired) ...[
        if (order.readyAt case final at?)
          (
            l10n.orderTimelineReady,
            l10n.orderTimelineToldBody(orderDate(l10n, at), formatTime(at)),
          ),
        (
          l10n.orderTimelineExpired,
          l10n.orderTimelineExpiredBody(formatTime(order.windowEnd)),
        ),
      ],
    ];
    final summary = switch (order.status) {
      OrderBodyStatus.cancelled => l10n.orderTimelineSummaryCancelled,
      OrderBodyStatus.refused => l10n.orderTimelineSummaryRefused(reason),
      OrderBodyStatus.expired => l10n.orderTimelineSummaryExpired(
        formatTime(order.windowEnd),
      ),
      _ => null,
    };

    return Card(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 14,
          children: [
            Semantics(
              header: true,
              child: Text(
                l10n.orderTimelineTitle.toUpperCase(),
                style: text.labelStrong.copyWith(
                  color: scheme.onSurfaceVariant,
                ),
              ),
            ),
            if (summary != null) Text(summary, style: text.bodySm),
            for (final (title, body) in moments)
              Row(
                spacing: SpacingTokens.space3,
                children: [
                  Icon(
                    LucideIcons.circleCheck,
                    size: 24,
                    color: colors.success,
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: text.bodySmStrong),
                        Text(
                          body,
                          style: text.label.copyWith(
                            color: scheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

/// Why the store refused an order, in the customer's words; "another
/// reason" without one.
String refuseReasonOf(AppLocalizations l10n, OrderBodyRefuseReason? reason) =>
    switch (reason) {
      OrderBodyRefuseReason.notSuitable => l10n.orderRefuseReasonNotSuitable,
      OrderBodyRefuseReason.wrongItems => l10n.orderRefuseReasonWrongItems,
      OrderBodyRefuseReason.noAnswer => l10n.orderRefuseReasonNoAnswer,
      OrderBodyRefuseReason.noShow => l10n.orderRefuseReasonNoShow,
      OrderBodyRefuseReason.valueLate => l10n.orderRefuseReasonLate,
      OrderBodyRefuseReason.soldOut => l10n.orderRefuseReasonSoldOut,
      OrderBodyRefuseReason.withdrawn => l10n.orderRefuseReasonWithdrawn,
      _ => l10n.orderRefuseReasonOther,
    };
