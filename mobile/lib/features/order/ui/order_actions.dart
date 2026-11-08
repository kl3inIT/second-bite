import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/l10n/l10n.dart';

// What a customer does to an order, as the web's cancel-order.tsx,
// review-form.tsx, review-given.tsx and order-problem.tsx: cancel it until
// it is ready, rate it once collected, report what went wrong within two
// days. Each reads the order again once the server answers, and shows the
// server's words when it refuses.

/// The order was changed: its page and the lists read it again.
void _changed(WidgetRef ref, OrderBody order) {
  ref
    ..invalidate(orderViewProvider(order.id))
    ..invalidate(myOrdersProvider);
}

/// The server's sentence for [error], or [fallback] without an answer.
String _failure(Object error, String fallback) {
  final detail = problemOf(error)?.detail;
  return detail == null || detail.isEmpty ? fallback : detail;
}

/// {@template cancel_order}
/// "Huỷ đơn", at the very end of an order still to be prepared: a sheet
/// that says the portions go back to the store, offers a reason, and
/// cancels or keeps the order. The reason goes in the customer's words.
/// {@endtemplate}
class CancelOrder extends ConsumerWidget {
  /// {@macro cancel_order}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;

    return AppButton(
      variant: AppButtonVariant.outline,
      onPressed: () async {
        final cancelled = await showModalBottomSheet<bool>(
          context: context,
          showDragHandle: true,
          isScrollControlled: true,
          builder: (_) => CancelSheet(order: order),
        );
        if (cancelled ?? false) _changed(ref, order);
      },
      child: Text(l10n.orderCancelOpen),
    );
  }
}

/// {@template cancel_sheet}
/// The sheet that cancels [order]: pops `true` once cancelled.
/// {@endtemplate}
class CancelSheet extends ConsumerStatefulWidget {
  /// {@macro cancel_sheet}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  ConsumerState<CancelSheet> createState() => _CancelSheetState();
}

class _CancelSheetState extends ConsumerState<CancelSheet> {
  String? _reason;
  String? _error;
  bool _pending = false;

  Future<void> _cancel() async {
    setState(() {
      _pending = true;
      _error = null;
    });
    try {
      await ref.read(orderReaderProvider).cancel(widget.order, reason: _reason);
      if (mounted) Navigator.of(context).pop(true);
    } on Object catch (error) {
      if (!mounted) return;
      setState(() {
        _pending = false;
        _error = _failure(error, context.l10n.orderCancelFailed);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final order = widget.order;
    final reasons = [
      l10n.orderCancelReasonLate,
      l10n.orderCancelReasonMistake,
      l10n.orderCancelReasonOther,
    ];
    final error = _error;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          0,
          SpacingTokens.space4,
          SpacingTokens.space4,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(
              header: true,
              child: Text(
                l10n.orderCancelTitle(order.number),
                style: text.headline,
              ),
            ),
            Text(
              l10n.orderCancelBody(unitsOf(order), order.seller.name),
              style: text.bodySm,
            ),
            Text(l10n.orderCancelReason, style: text.labelStrong),
            Wrap(
              spacing: SpacingTokens.space2,
              runSpacing: SpacingTokens.space2,
              children: [
                for (final reason in reasons)
                  ChoiceChip(
                    label: Text(reason),
                    selected: _reason == reason,
                    onSelected: (on) =>
                        setState(() => _reason = on ? reason : null),
                  ),
              ],
            ),
            if (error != null)
              AppAlert(
                icon: LucideIcons.circleAlert,
                title: error,
                description: '',
              ),
            AppButton(
              variant: AppButtonVariant.destructive,
              onPressed: _pending ? null : _cancel,
              child: Text(l10n.orderCancelConfirm),
            ),
            AppButton(
              variant: AppButtonVariant.secondary,
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(l10n.orderCancelKeep),
            ),
          ],
        ),
      ),
    );
  }
}

/// The word for [stars] stars, "Tốt" for four.
String starWord(AppLocalizations l10n, int stars) => switch (stars) {
  1 => l10n.reviewWord1,
  2 => l10n.reviewWord2,
  3 => l10n.reviewWord3,
  4 => l10n.reviewWord4,
  _ => l10n.reviewWord5,
};

/// What went well, in the customer's words.
String reviewTagOf(AppLocalizations l10n, String tag) => switch (tag) {
  'fast_pickup' => l10n.reviewTagFastPickup,
  'good_quality' => l10n.reviewTagGoodQuality,
  'good_variety' => l10n.reviewTagGoodVariety,
  'fair_portions' => l10n.reviewTagFairPortions,
  _ => tag,
};

/// {@template review_form}
/// "Món hôm nay thế nào?" under a collected order (Figma K6b): five stars
/// with their word, what went well, a few words, and sending it. Without a
/// star it says to choose one.
/// {@endtemplate}
class ReviewForm extends ConsumerStatefulWidget {
  /// {@macro review_form}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  ConsumerState<ReviewForm> createState() => _ReviewFormState();
}

class _ReviewFormState extends ConsumerState<ReviewForm> {
  final _comment = TextEditingController();
  int _stars = 0;
  final Set<ReviewOrderRequestTags> _tags = {};
  String? _error;
  bool _pending = false;

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final l10n = context.l10n;
    if (_stars == 0) {
      setState(() => _error = l10n.reviewErrorStars);
      return;
    }
    setState(() {
      _pending = true;
      _error = null;
    });
    try {
      final comment = _comment.text.trim();
      await ref
          .read(orderReaderProvider)
          .review(
            widget.order,
            stars: _stars,
            tags: [
              for (final tag in ReviewOrderRequestTags.$valuesDefined)
                if (_tags.contains(tag)) tag,
            ],
            comment: comment.isEmpty ? null : comment,
          );
      if (mounted) _changed(ref, widget.order);
    } on Object catch (error) {
      if (!mounted) return;
      setState(() {
        _pending = false;
        _error = _failure(error, l10n.reviewFailed);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final colors = context.appColors;
    final error = _error;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: SpacingTokens.space3,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.reviewTitle, style: text.title),
            ),
            Text(
              l10n.reviewHint,
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
            Semantics(
              container: true,
              label: l10n.reviewStarsLegend,
              child: Row(
                children: [
                  for (var star = 1; star <= 5; star++)
                    Semantics(
                      selected: _stars == star,
                      button: true,
                      label:
                          '${l10n.reviewStar(star)} · '
                          '${starWord(l10n, star)}',
                      excludeSemantics: true,
                      child: IconButton(
                        onPressed: () => setState(() {
                          _stars = star;
                          _error = null;
                        }),
                        icon: Icon(
                          LucideIcons.star,
                          size: 32,
                          color: star <= _stars
                              ? colors.rating
                              : scheme.outlineVariant,
                        ),
                      ),
                    ),
                  if (_stars > 0)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(
                        start: SpacingTokens.space2,
                      ),
                      child: Text(
                        starWord(l10n, _stars),
                        style: text.bodySmStrong,
                      ),
                    ),
                ],
              ),
            ),
            Text(l10n.reviewTagsTitle, style: text.labelStrong),
            Wrap(
              spacing: SpacingTokens.space2,
              runSpacing: SpacingTokens.space2,
              children: [
                for (final tag in ReviewOrderRequestTags.$valuesDefined)
                  FilterChip(
                    label: Text(reviewTagOf(l10n, tag.json ?? '')),
                    selected: _tags.contains(tag),
                    onSelected: (on) =>
                        setState(() => on ? _tags.add(tag) : _tags.remove(tag)),
                  ),
              ],
            ),
            TextField(
              controller: _comment,
              maxLength: 500,
              minLines: 2,
              maxLines: 4,
              decoration: InputDecoration(labelText: l10n.reviewComment),
            ),
            if (error != null)
              Semantics(
                liveRegion: true,
                child: Text(
                  error,
                  style: text.label.copyWith(color: scheme.error),
                ),
              ),
            AppButton(
              onPressed: _pending ? null : _send,
              child: Text(l10n.reviewSubmit),
            ),
          ],
        ),
      ),
    );
  }
}

/// {@template review_given}
/// The rating a customer gave: its stars and word, what went well and
/// their words.
/// {@endtemplate}
class ReviewGiven extends StatelessWidget {
  /// {@macro review_given}
  const new({required this.review, super.key});

  /// The rating.
  final ReviewBody review;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final comment = review.comment;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.reviewGiven, style: text.title),
            ),
            Semantics(
              label:
                  '${l10n.reviewStar(review.stars)} · '
                  '${starWord(l10n, review.stars)}',
              excludeSemantics: true,
              child: Row(
                spacing: 2,
                children: [
                  for (var star = 1; star <= 5; star++)
                    Icon(
                      LucideIcons.star,
                      size: 20,
                      color: star <= review.stars
                          ? context.appColors.rating
                          : scheme.outlineVariant,
                    ),
                  const SizedBox(width: SpacingTokens.space2),
                  Text(starWord(l10n, review.stars), style: text.bodySmStrong),
                ],
              ),
            ),
            if (review.tags.isNotEmpty)
              Text(
                review.tags.map((tag) => reviewTagOf(l10n, tag)).join(' · '),
                style: text.label,
              ),
            if (comment != null && comment.isNotEmpty)
              Text(comment, style: text.bodySm),
            Text(
              l10n.reviewThanks,
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
          ],
        ),
      ),
    );
  }
}

/// The kind of problem, in the customer's words.
String problemKindOf(AppLocalizations l10n, String kind) => switch (kind) {
  'missing_item' => l10n.orderProblemKindMissingItem,
  'wrong_item' => l10n.orderProblemKindWrongItem,
  'poor_quality' => l10n.orderProblemKindPoorQuality,
  'store_closed' => l10n.orderProblemKindStoreClosed,
  _ => kind,
};

/// {@template order_problem_section}
/// A collected or expired order's problem (SEC-84): the one reported, sent
/// to the store, with its answer or that one will come; or, while the
/// order may still be reported, the way to report it.
/// {@endtemplate}
class OrderProblemSection extends ConsumerWidget {
  /// {@macro order_problem_section}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final problem = order.problem;
    if (problem != null) return _Reported(order: order, problem: problem);
    if (!order.canReportProblem) return const SizedBox.shrink();

    return AppButton(
      variant: AppButtonVariant.outline,
      onPressed: () async {
        final sent = await showModalBottomSheet<bool>(
          context: context,
          showDragHandle: true,
          isScrollControlled: true,
          builder: (_) => ProblemSheet(order: order),
        );
        if (sent ?? false) _changed(ref, order);
      },
      child: Text(l10n.orderProblemOpen),
    );
  }
}

class _Reported extends StatelessWidget {
  const new({required this.order, required this.problem});

  final OrderBody order;
  final ProblemBody problem;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final note = problem.note;
    final answer = problem.answer;
    final answeredAt = problem.answeredAt;
    final kind = problemKindOf(l10n, problem.kind.json ?? '');
    final at = formatTime(problem.reportedAt);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(SpacingTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: SpacingTokens.space2,
          children: [
            Semantics(
              header: true,
              child: Text(l10n.orderProblemReportedTitle, style: text.title),
            ),
            Text(kind, style: text.bodySmStrong),
            Text(
              note == null || note.isEmpty
                  ? at
                  : l10n.orderProblemNoteAt(at, note),
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
            Text(
              l10n.orderProblemSent(order.seller.name),
              style: text.label.copyWith(color: scheme.onSurfaceVariant),
            ),
            if (answer != null && answeredAt != null) ...[
              Text(
                l10n.orderProblemAnswered(
                  order.seller.name,
                  formatTime(answeredAt),
                ),
                style: text.labelStrong,
              ),
              Text(answer, style: text.bodySm),
            ] else
              Text(
                l10n.orderProblemWaiting,
                style: text.label.copyWith(color: scheme.onSurfaceVariant),
              ),
          ],
        ),
      ),
    );
  }
}

/// {@template problem_sheet}
/// The sheet that reports what went wrong with [order]: one kind, a note,
/// and sending it to the store. Pops `true` once sent.
/// {@endtemplate}
class ProblemSheet extends ConsumerStatefulWidget {
  /// {@macro problem_sheet}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  ConsumerState<ProblemSheet> createState() => _ProblemSheetState();
}

class _ProblemSheetState extends ConsumerState<ProblemSheet> {
  final _note = TextEditingController();
  ReportOrderProblemRequestKind? _kind;
  String? _error;
  bool _pending = false;

  @override
  void dispose() {
    _note.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final l10n = context.l10n;
    final kind = _kind;
    if (kind == null) {
      setState(() => _error = l10n.orderProblemErrorKind);
      return;
    }
    setState(() {
      _pending = true;
      _error = null;
    });
    try {
      final note = _note.text.trim();
      await ref
          .read(orderReaderProvider)
          .reportProblem(
            widget.order,
            kind: kind,
            note: note.isEmpty ? null : note,
          );
      if (mounted) Navigator.of(context).pop(true);
    } on Object catch (error) {
      if (!mounted) return;
      setState(() {
        _pending = false;
        _error = _failure(error, l10n.orderProblemFailed);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final error = _error;

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(
          SpacingTokens.space4,
          0,
          SpacingTokens.space4,
          SpacingTokens.space4 + MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: SpacingTokens.space3,
            children: [
              Semantics(
                header: true,
                child: Text(
                  l10n.orderProblemTitle(widget.order.number),
                  style: text.headline,
                ),
              ),
              Text(l10n.orderProblemBody, style: text.bodySm),
              Text(l10n.orderProblemKindLegend, style: text.labelStrong),
              Wrap(
                spacing: SpacingTokens.space2,
                runSpacing: SpacingTokens.space2,
                children: [
                  for (final kind
                      in ReportOrderProblemRequestKind.$valuesDefined)
                    ChoiceChip(
                      label: Text(problemKindOf(l10n, kind.json ?? '')),
                      selected: _kind == kind,
                      onSelected: (on) => setState(() {
                        _kind = on ? kind : null;
                        _error = null;
                      }),
                    ),
                ],
              ),
              TextField(
                controller: _note,
                maxLength: 500,
                minLines: 2,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: l10n.orderProblemNote,
                  hintText: l10n.orderProblemNotePlaceholder,
                ),
              ),
              if (error != null)
                Semantics(
                  liveRegion: true,
                  child: Text(
                    error,
                    style: text.label.copyWith(color: scheme.error),
                  ),
                ),
              AppButton(
                onPressed: _pending ? null : _send,
                child: Text(l10n.orderProblemSend),
              ),
              AppButton(
                variant: AppButtonVariant.secondary,
                onPressed: () => Navigator.of(context).pop(false),
                child: Text(l10n.orderProblemLater),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
