import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/domain/order_facts.dart';
import 'package:second_bite/l10n/l10n.dart';

part 'order_chat.g.dart';

// The ways into an order's chat from its page (SEC-117, Figma D2b, D4;
// SEC-204 step 12), as the web's chat-entry.tsx and unread-banner.tsx.

// A failure shows nothing rather than retrying behind the page.
Duration? _never(int retryCount, Object error) => null;

/// [orderId]'s chat as its page reads it, with the order's [access] when it
/// was placed without an account.
@Riverpod(retry: _never)
Future<MessagesOutputBody> orderChat(Ref ref, String orderId, String? access) =>
    ref.watch(orderReaderProvider).readChat(orderId, access: access);

/// {@template chat_entry}
/// "Nhắn quán" on an order's page with the count of messages not read yet:
/// while the order is open, and after it was collected until its chat
/// closes; "Xem tin nhắn" once the chat can only be read, and then only
/// when the order has messages. Whether a collected order's chat is still
/// open is read from the chat. Nothing otherwise.
/// {@endtemplate}
class ChatEntry extends ConsumerWidget {
  /// {@macro chat_entry}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = context.l10n;
    final bool writable;
    if (isOpen(order)) {
      writable = true;
    } else {
      if ((order.messageCount ?? 0) == 0) return const SizedBox.shrink();
      writable =
          order.status == OrderBodyStatus.collected &&
          (ref.watch(orderChatProvider(order.id, order.access)).value?.open ??
              false);
    }
    final unread = order.unreadMessages ?? 0;

    return AppButton(
      variant: AppButtonVariant.secondary,
      onPressed: () => OrderChatRoute(orderId: order.id).go(context),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: SpacingTokens.space2,
        children: [
          Flexible(
            child: Text(
              writable ? l10n.chatMessageStore : l10n.chatViewMessages,
            ),
          ),
          AppUnreadPill(count: unread, label: l10n.chatUnread(unread)),
        ],
      ),
    );
  }
}

/// {@template unread_banner}
/// "Quán vừa nhắn" at the top of an order's page (Figma D4): the store's
/// latest message in quotes and the way to the chat, while messages are
/// unread and the chat can still be answered. The order carries only the
/// count, so the words are read from the chat. Nothing otherwise.
/// {@endtemplate}
class UnreadBanner extends ConsumerWidget {
  /// {@macro unread_banner}
  const new({required this.order, super.key});

  /// The order.
  final OrderBody order;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if ((order.unreadMessages ?? 0) == 0) return const SizedBox.shrink();
    final chat = ref.watch(orderChatProvider(order.id, order.access)).value;
    final latest = chat?.messages
        .where((message) => message.from == MessageBodyFrom.seller)
        .lastOrNull;
    // A chat past its time is read, not answered, so nothing calls for a
    // reply.
    if (chat == null || latest == null || !chat.open) {
      return const SizedBox.shrink();
    }
    final l10n = context.l10n;
    final text = context.appTextStyles;
    final scheme = Theme.of(context).colorScheme;

    return Card(
      shape: RoundedRectangleBorder(
        side: BorderSide(color: scheme.secondaryContainer),
        borderRadius: BorderRadius.circular(RadiusTokens.xl),
      ),
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 12, 12),
        child: Row(
          spacing: SpacingTokens.space3,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: scheme.surfaceContainerHighest,
                  child: Icon(
                    LucideIcons.messageCircle,
                    size: 18,
                    color: scheme.primary,
                  ),
                ),
                PositionedDirectional(
                  top: -2,
                  end: -2,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: scheme.error,
                      shape: BoxShape.circle,
                      border: Border.all(color: scheme.surface, width: 2),
                    ),
                    child: const SizedBox.square(dimension: 10),
                  ),
                ),
              ],
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 2,
                children: [
                  Semantics(
                    header: true,
                    child: Text(l10n.chatStoreWrote, style: text.bodySmStrong),
                  ),
                  Text(
                    l10n.chatQuote(latest.text),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: text.label.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: () => OrderChatRoute(orderId: order.id).go(context),
              child: Text(l10n.chatSeeMessage),
            ),
          ],
        ),
      ),
    );
  }
}
