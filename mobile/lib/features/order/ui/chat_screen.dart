import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/core/not_found_screen.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/offer/ui/offer_format.dart';
import 'package:second_bite/features/order/data/order_live.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/domain/chat.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/features/order/ui/order_chat.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/l10n/l10n.dart';
import 'package:uuid/uuid.dart';

/// While the socket is down, an open chat reads what is new this often.
const _poll = Duration(seconds: 5);

/// {@template chat_screen}
/// A customer's chat with the store of an order at `/orders/:orderId/chat`
/// (SEC-117, Figma K7, K7b; SEC-204 step 12), as the web's `CustomerChat`
/// on a phone: the blue bar with the store's name, the order's card and
/// the day, the messages, the store's on the left and the reader's on the
/// right with "Đã xem" once read, and the foot to write in. The order is
/// read as its page reads it, so an order placed without an account opens
/// with the access this phone keeps.
/// {@endtemplate}
class ChatScreen extends ConsumerWidget {
  /// {@macro chat_screen}
  const new({required this.orderId, super.key});

  /// The order.
  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final view = ref.watch(orderViewProvider(orderId));
    void back() {
      if (context.canPop()) {
        context.pop();
      } else {
        OrderRoute(orderId: orderId).go(context);
      }
    }

    Widget barred(String title, Widget body) => Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: back,
          tooltip: l10n.topBarBack,
          icon: const Icon(LucideIcons.chevronLeft),
        ),
        title: Text(title),
      ),
      body: body,
    );

    return switch (view) {
      AsyncData(value: null) => const NotFoundScreen(),
      AsyncData(value: final OrderView found) => barred(
        found.order.seller.name,
        ChatPanel(order: found.order),
      ),
      AsyncError(error: OrderUnknown()) => barred(
        l10n.ordersTitle,
        OrdersSignInPrompt(returnTo: '/orders/$orderId/chat'),
      ),
      AsyncError(:final error) => barred(
        l10n.ordersTitle,
        OrderFailure(
          error: error,
          onRetry: () => ref.invalidate(orderViewProvider(orderId)),
        ),
      ),
      _ => barred(
        l10n.ordersTitle,
        const Center(child: CircularProgressIndicator()),
      ),
    };
  }
}

/// A message being sent, or one that was not sent and waits for another try
/// with the same key.
typedef _Outgoing = ({String key, String text, bool failed});

/// {@template chat_panel}
/// An order's chat, as the web's `ChatPanel` for the customer: its messages
/// are read once, then what is new after each notice of the order on the
/// live socket, and every 5 seconds while the socket is down. A message is
/// sent with its own `Idempotency-Key`, shown at once, and kept with "Gửi
/// lại" when it fails; the store's messages are marked read while the app
/// is in front. The chat turns read-only when the API says so or, while the
/// order is open, at the end of its window.
/// {@endtemplate}
class ChatPanel extends ConsumerStatefulWidget {
  /// {@macro chat_panel}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  ConsumerState<ChatPanel> createState() => _ChatPanelState();
}

class _ChatPanelState extends ConsumerState<ChatPanel> {
  late final LiveClient _live;
  late final OrderReader _reader;
  late final AppLifecycleListener _lifecycle;
  late final void Function() _stopFollowing;
  late final void Function() _stopPolling;
  MessagesOutputBody? _chat;
  Object? _failure;
  List<_Outgoing> _outbox = const [];
  int _marking = 0;
  bool _passed = false;
  Timer? _pollTimer;
  Timer? _deadline;

  OrderBody get _order => widget.order;

  @override
  void initState() {
    super.initState();
    _live = ref.read(liveClientProvider);
    _reader = ref.read(orderReaderProvider);
    _lifecycle = AppLifecycleListener(onResume: _markSeen);
    _stopFollowing = _live.follow([orderTopic(_order.id)], (event) {
      if (event is LiveSynced ||
          (event is LiveNotice && event.orderId == _order.id)) {
        unawaited(_readNew());
      }
    });
    _stopPolling = _live.onPollingChange(_pollingChanged);
    _pollingChanged();
    unawaited(_readFirst());
  }

  Future<void> _readFirst() async {
    try {
      final chat = await ref.read(
        orderChatProvider(_order.id, _order.access).future,
      );
      _take(chat);
    } on Object catch (error) {
      if (mounted) setState(() => _failure = error);
    }
  }

  Future<void> _readNew() async {
    try {
      final chat = await _reader.readChat(
        _order.id,
        access: _order.access,
        after: lastSeq(_chat),
      );
      _take(chat);
    } on Object {
      // The next notice or poll reads again.
    }
  }

  void _take(MessagesOutputBody incoming) {
    if (!mounted) return;
    setState(() {
      _chat = mergeChat(_chat, incoming);
      _failure = null;
    });
    _watchDeadline();
    _markSeen();
  }

  void _pollingChanged() {
    _pollTimer?.cancel();
    _pollTimer = null;
    if (!_live.polling) return;
    _pollTimer = Timer.periodic(_poll, (_) {
      if (_inFront()) unawaited(_readNew());
    });
  }

  bool _inFront() {
    final state = WidgetsBinding.instance.lifecycleState;
    return state == null || state == AppLifecycleState.resumed;
  }

  /// Marks the store's messages read up to the last one, while the app is
  /// in front; a mark that failed is tried again with the next message.
  void _markSeen() {
    final chat = _chat;
    if (chat == null || !_inFront()) return;
    final upTo = unseenUpTo(chat, MessageBodyFrom.customer);
    if (upTo == 0 || upTo <= _marking) return;
    _marking = upTo;
    unawaited(
      _reader
          .markSeen(_order.id, upTo, access: _order.access)
          .then(
            (_) {
              if (!mounted) return;
              setState(
                () => _chat = withSeen(_chat!, MessageBodyFrom.customer, upTo),
              );
              // The order's page and the tab show the unread count.
              ref
                ..invalidate(orderViewProvider(_order.id))
                ..invalidate(myOrdersProvider);
            },
            onError: (Object _) {
              _marking = 0;
            },
          ),
    );
  }

  void _watchDeadline() {
    _deadline?.cancel();
    final chat = _chat;
    if (chat == null) return;
    final until = chatClosesAt(chat, isOpen(_order) ? _order.windowEnd : null);
    if (until == null) return;
    final wait = until.difference(DateTime.now());
    if (wait <= Duration.zero) {
      _passed = true;
      return;
    }
    _deadline = Timer(wait, () {
      if (mounted) setState(() => _passed = true);
    });
  }

  void _send(String text) {
    final item = (key: const Uuid().v4(), text: text, failed: false);
    setState(() => _outbox = [..._outbox, item]);
    unawaited(_deliver(item));
  }

  Future<void> _deliver(_Outgoing item) async {
    setState(() {
      _outbox = [
        for (final each in _outbox) _failed(each, item.key, failed: false),
      ];
    });
    try {
      final sent = await _reader.sendMessage(
        _order.id,
        item.text,
        key: item.key,
        access: _order.access,
      );
      if (!mounted) return;
      setState(() {
        _chat = withMessage(_chat!, sent);
        _outbox = [
          for (final each in _outbox)
            if (each.key != item.key) each,
        ];
      });
    } on Object catch (error) {
      if (!mounted) return;
      setState(() {
        if (problemOf(error)?.code == 'ORDER_CHAT_CLOSED') {
          _chat = closedChat(_chat!);
          _outbox = [
            for (final each in _outbox)
              if (each.key != item.key) each,
          ];
          return;
        }
        _outbox = [
          for (final each in _outbox) _failed(each, item.key, failed: true),
        ];
      });
    }
  }

  /// [each], marked [failed] when it is the message sent under [key].
  _Outgoing _failed(_Outgoing each, String key, {required bool failed}) =>
      each.key == key ? (key: key, text: each.text, failed: failed) : each;

  @override
  void dispose() {
    _stopFollowing();
    _stopPolling();
    _pollTimer?.cancel();
    _deadline?.cancel();
    _lifecycle.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chat = _chat;
    final failure = _failure;
    if (chat == null) {
      return failure == null
          ? const Center(child: CircularProgressIndicator())
          : OrderFailure(
              error: failure,
              onRetry: () {
                setState(() => _failure = null);
                ref.invalidate(orderChatProvider(_order.id, _order.access));
                unawaited(_readFirst());
              },
            );
    }
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;
    final locked = !chat.open || _passed;
    final day = dayOf(_order.createdAt, DateTime.now()) == OrderDay.today
        ? l10n.chatConfirmedToday(_order.number)
        : l10n.chatConfirmedOn(
            orderDate(l10n, _order.createdAt),
            _order.number,
          );

    final items = <Widget>[
      _ChatOrderCard(order: _order),
      Text(day, style: text.label.copyWith(color: scheme.onSurfaceVariant)),
      for (final message in chat.messages)
        AppChatBubble(
          text: message.text,
          own: message.from == MessageBodyFrom.customer,
          ownLabel: l10n.chatMine,
          caption: Text(
            message.from == MessageBodyFrom.customer && isSeen(chat, message)
                ? l10n.chatSeen(formatTime(message.sentAt))
                : formatTime(message.sentAt),
            style: text.label.copyWith(color: scheme.onSurfaceVariant),
          ),
        ),
      for (final item in _outbox)
        AppChatBubble(
          text: item.text,
          own: true,
          ownLabel: l10n.chatMine,
          caption: item.failed
              ? Semantics(
                  liveRegion: true,
                  child: Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        '${l10n.chatFailed} · ',
                        style: text.label.copyWith(color: scheme.error),
                      ),
                      InkWell(
                        onTap: () => unawaited(_deliver(item)),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Text(
                            l10n.chatRetry,
                            style: text.labelStrong.copyWith(
                              color: scheme.error,
                              decoration: TextDecoration.underline,
                              decorationColor: scheme.error,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : null,
        ),
    ];

    return ColoredBox(
      color: scheme.surfaceContainerLow,
      child: Column(
        children: [
          Expanded(
            child: Semantics(
              label: l10n.chatLog,
              container: true,
              // Newest at the bottom, kept in view as messages arrive.
              child: ListView.separated(
                reverse: true,
                padding: const EdgeInsets.all(SpacingTokens.space4),
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(height: 14),
                itemBuilder: (_, index) => items[items.length - 1 - index],
              ),
            ),
          ),
          ChatFooter(locked: locked, onSend: _send),
        ],
      ),
    );
  }
}

/// The order's card at the head of a chat (Figma K7): its first dish's
/// photo, the dishes and the window, and what it costs above what it would
/// have cost.
class _ChatOrderCard extends StatelessWidget {
  const new({required this.order});

  final OrderBody order;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          spacing: SpacingTokens.space3,
          children: [
            OrderThumb(order: order, size: 56),
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
                  Text(
                    l10n.chatCardMeta(
                      unitsOf(order),
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
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(formatPrice(order.payVnd), style: text.price),
                Text(
                  formatPrice(order.payVnd + savingOf(order)),
                  style: text.label.copyWith(
                    color: scheme.onSurfaceVariant,
                    decoration: TextDecoration.lineThrough,
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

/// {@template chat_footer}
/// The foot of a chat (Figma K7, K7b): the note that messages change
/// nothing of the order, quick replies that send at once and go while a
/// person types, and the field with its send button. Once the chat is
/// read-only the foot says so instead.
/// {@endtemplate}
class ChatFooter extends StatefulWidget {
  /// {@macro chat_footer}
  const new({required this.locked, required this.onSend, super.key});

  /// Whether the chat can only be read.
  final bool locked;

  /// Sends a message.
  final ValueChanged<String> onSend;

  @override
  State<ChatFooter> createState() => _ChatFooterState();
}

class _ChatFooterState extends State<ChatFooter> {
  final _field = TextEditingController();

  @override
  void initState() {
    super.initState();
    _field.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _field.dispose();
    super.dispose();
  }

  void _submit() {
    final body = _field.text.trim();
    if (body.isEmpty) return;
    widget.onSend(body);
    _field.clear();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    if (widget.locked) {
      return Material(
        color: scheme.surface,
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              spacing: SpacingTokens.space2,
              children: [
                Icon(
                  LucideIcons.lock,
                  size: 18,
                  color: scheme.onSurfaceVariant,
                ),
                Flexible(
                  child: Text(
                    l10n.chatLocked,
                    style: text.bodySm.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final replies = [
      l10n.chatReplyComing,
      l10n.chatReplyLate,
      l10n.chatReplyStillHave,
    ];

    return Material(
      color: scheme.surface,
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.only(top: 12, bottom: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            spacing: SpacingTokens.space2,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  l10n.chatNote,
                  style: text.label.copyWith(color: scheme.onSurfaceVariant),
                ),
              ),
              if (_field.text.isEmpty)
                Semantics(
                  label: l10n.chatQuickReplies,
                  container: true,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      spacing: SpacingTokens.space2,
                      children: [
                        for (final reply in replies)
                          ActionChip(
                            label: Text(reply),
                            onPressed: () => widget.onSend(reply),
                          ),
                      ],
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  spacing: SpacingTokens.space2,
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _field,
                        maxLength: chatMaxLength,
                        textInputAction: TextInputAction.send,
                        onSubmitted: (_) => _submit(),
                        decoration: InputDecoration(
                          hintText: l10n.chatPlaceholderToStore,
                          counterText: '',
                        ),
                      ),
                    ),
                    IconButton.filled(
                      onPressed: _field.text.trim().isEmpty ? null : _submit,
                      tooltip: l10n.chatSend,
                      icon: const Icon(LucideIcons.send),
                    ),
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
