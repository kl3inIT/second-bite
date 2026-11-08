import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/domain/chat.dart';

// Ported from web/src/features/chat/chat-model.test.ts, case for case.

MessageBody _message(int seq, MessageBodyFrom from) => MessageBody(
  seq: seq,
  from: from,
  text: 'm$seq',
  sentAt: DateTime.parse('2026-10-21T13:14:00Z'),
);

MessagesOutputBody _chat(
  List<MessageBody> messages, {
  SeenBody seen = const SeenBody(customer: 0, seller: 0),
}) => MessagesOutputBody(messages: messages, seen: seen, open: true);

const MessageBodyFrom _customer = MessageBodyFrom.customer;
const MessageBodyFrom _seller = MessageBodyFrom.seller;

void main() {
  group('an order chat', () {
    test('merges messages by number, each once and oldest first', () {
      final merged = mergeChat(
        _chat([_message(1, _seller), _message(2, _customer)]),
        _chat([_message(3, _seller), _message(2, _customer)]),
      );

      expect(merged.messages.map((m) => m.seq), [1, 2, 3]);
    });

    test("never takes back what a side has seen, and keeps the newer read's "
        'state', () {
      final closesAt = DateTime.parse('2026-10-21T15:00:00Z');
      final merged = mergeChat(
        _chat(
          const [],
          seen: const SeenBody(customer: 4, seller: 1),
        ).copyWith(closesAt: closesAt),
        _chat(
          const [],
          seen: const SeenBody(customer: 2, seller: 3),
        ).copyWith(open: false),
      );

      expect(merged.seen, const SeenBody(customer: 4, seller: 3));
      expect(merged.open, isFalse);
      expect(merged.closesAt, closesAt);
    });

    test('takes the first read as it is', () {
      final first = _chat([_message(1, _seller)]);
      expect(mergeChat(null, first), same(first));
    });

    test('asks after the last message it holds', () {
      expect(lastSeq(null), 0);
      expect(lastSeq(_chat(const [])), 0);
      expect(lastSeq(_chat([_message(1, _seller), _message(5, _customer)])), 5);
    });

    test('adds a message sent, a mark seen, and the end of the chat', () {
      final base = _chat([_message(1, _seller)]);

      expect(withMessage(base, _message(2, _customer)).messages, hasLength(2));
      expect(
        withSeen(base, _customer, 1).seen,
        const SeenBody(customer: 1, seller: 0),
      );
      expect(
        withSeen(withSeen(base, _customer, 3), _customer, 1).seen.customer,
        3,
      );
      expect(closedChat(base).open, isFalse);
    });

    test('finds the last message of the other side that a side has not '
        'seen', () {
      final messages = [
        _message(1, _seller),
        _message(2, _customer),
        _message(3, _seller),
      ];

      expect(unseenUpTo(_chat(messages), _customer), 3);
      expect(
        unseenUpTo(
          _chat(messages, seen: const SeenBody(customer: 3, seller: 0)),
          _customer,
        ),
        0,
      );
      expect(unseenUpTo(_chat(messages), _seller), 2);
      expect(unseenUpTo(_chat([_message(1, _customer)]), _customer), 0);
    });

    test('knows a message was seen once the other side has read up to it', () {
      final own = _message(2, _customer);
      expect(
        isSeen(_chat([own], seen: const SeenBody(customer: 0, seller: 1)), own),
        isFalse,
      );
      expect(
        isSeen(_chat([own], seen: const SeenBody(customer: 0, seller: 2)), own),
        isTrue,
      );
    });

    test('closes at the time the API gives, or else at the window end', () {
      final a = DateTime.parse('2026-10-21T15:00:00Z');
      final b = DateTime.parse('2026-10-21T16:00:00Z');
      expect(chatClosesAt(_chat(const []).copyWith(closesAt: a), b), a);
      expect(chatClosesAt(_chat(const []), b), b);
      expect(chatClosesAt(_chat(const []), null), isNull);
    });
  });
}
