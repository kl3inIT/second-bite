import 'package:second_bite/core/api.dart';

// What an order's chat holds on the phone (SEC-117 › docs/specs/order.md ›
// The chat; SEC-204 step 12), ported from the web's
// web/src/features/chat/chat-model.ts: its messages by number, what each
// side has seen, and whether it still takes messages. The chat is the API's
// own answer, `MessagesOutputBody`.

/// The messages the API gives in a page, at most.
const chatPageSize = 100;

/// A chat holds at most 500 messages (docs/specs/order.md), which is this
/// many pages.
const chatMaxPages = 5;

/// The longest message the API takes.
const chatMaxLength = 1000;

/// The side that did not write a message from [side].
MessageBodyFrom otherSide(MessageBodyFrom side) =>
    side == MessageBodyFrom.customer
    ? MessageBodyFrom.seller
    : MessageBodyFrom.customer;

/// The number of the last message held, 0 for none: what `after` asks from.
int lastSeq(MessagesOutputBody? chat) => chat?.messages.lastOrNull?.seq ?? 0;

/// What the phone holds once [incoming] is read: the messages of both by
/// number, each once and oldest first; what each side has seen only ever
/// rises (a late answer never takes a mark back); the rest is the newer
/// read's.
MessagesOutputBody mergeChat(
  MessagesOutputBody? current,
  MessagesOutputBody incoming,
) {
  if (current == null) return incoming;
  final bySeq = <int, MessageBody>{
    for (final message in [...current.messages, ...incoming.messages])
      message.seq: message,
  };
  return MessagesOutputBody(
    messages: bySeq.values.toList()..sort((a, b) => a.seq.compareTo(b.seq)),
    seen: SeenBody(
      customer: current.seen.customer > incoming.seen.customer
          ? current.seen.customer
          : incoming.seen.customer,
      seller: current.seen.seller > incoming.seen.seller
          ? current.seen.seller
          : incoming.seen.seller,
    ),
    open: incoming.open,
    closesAt: incoming.closesAt ?? current.closesAt,
  );
}

/// The chat with a message the reader has just sent added.
MessagesOutputBody withMessage(MessagesOutputBody chat, MessageBody message) =>
    mergeChat(chat, chat.copyWith(messages: [message]));

/// The chat with [side] having seen up to [seq].
MessagesOutputBody withSeen(
  MessagesOutputBody chat,
  MessageBodyFrom side,
  int seq,
) => mergeChat(
  chat,
  chat.copyWith(
    messages: const [],
    seen: side == MessageBodyFrom.customer
        ? chat.seen.copyWith(customer: seq)
        : chat.seen.copyWith(seller: seq),
  ),
);

/// The chat as it stands once the API has refused a message because the
/// order ended.
MessagesOutputBody closedChat(MessagesOutputBody chat) =>
    chat.copyWith(open: false);

/// The last message the other side wrote that [side] has not seen, 0 for
/// none.
int unseenUpTo(MessagesOutputBody chat, MessageBodyFrom side) {
  final theirs = chat.messages.where(
    (message) => message.from == otherSide(side),
  );
  final last = theirs.lastOrNull?.seq ?? 0;
  final seen = side == MessageBodyFrom.customer
      ? chat.seen.customer
      : chat.seen.seller;
  return last > seen ? last : 0;
}

/// Whether [message] has been seen by the side that did not write it.
bool isSeen(MessagesOutputBody chat, MessageBody message) =>
    message.seq <=
    (otherSide(message.from) == MessageBodyFrom.customer
        ? chat.seen.customer
        : chat.seen.seller);

/// When the chat turns read-only: the API says so once the order is
/// collected; before that it is the end of the order's window, given while
/// the order is open. Null when neither is known.
DateTime? chatClosesAt(MessagesOutputBody chat, DateTime? windowEnd) =>
    chat.closesAt ?? windowEnd;
