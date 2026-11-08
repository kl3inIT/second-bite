import 'dart:convert';

import 'package:fake_async/fake_async.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/live_client.dart';

// Ported from web/src/lib/live-client.test.ts, case for case, with fake
// time in place of vitest's timers.

const _order = 'order:o1';
const _seller = 'order:o2';

class _FakeSocket {
  new() {
    socket = LiveSocket(
      send: (data) => sent.add(jsonDecode(data)),
      close: () => closed = true,
    );
  }

  late final LiveSocket socket;
  final List<Object?> sent = [];
  bool closed = false;

  void open() => socket.onOpen?.call();

  void receive(Map<String, Object?> frame) =>
      socket.onMessage?.call(jsonEncode(frame));

  void drop() => socket.onClose?.call();
}

class _Setup {
  new({LiveMint? mint}) {
    client = LiveClient(
      url: () => Uri.parse('ws://test/api/live'),
      mint:
          mint ??
          (topics) async {
            minted.add(topics);
            return {for (final topic in topics) topic: 'ticket-$topic'};
          },
      createSocket: (_) {
        final socket = _FakeSocket();
        sockets.add(socket);
        return socket.socket;
      },
      random: () => 0.5,
    );
  }

  late final LiveClient client;
  final List<List<String>> minted = [];
  final List<_FakeSocket> sockets = [];
  final List<LiveEvent> events = [];

  _FakeSocket get last => sockets.last;

  void listen(LiveEvent event) => events.add(event);
}

Map<String, Object?> _subscribe(String topic) => {
  'type': 'subscribe',
  'ticket': 'ticket-$topic',
};

void main() {
  group('parseLiveFrame', () {
    test('reads the documented frames', () {
      expect(
        parseLiveFrame('{"type":"subscribed","topic":"order:o1"}'),
        isA<SubscribedFrame>().having((f) => f.topic, 'topic', 'order:o1'),
      );
      expect(parseLiveFrame('{"type":"resync"}'), isA<ResyncFrame>());
      expect(
        parseLiveFrame(
          '{"type":"message","orderId":"o1","seq":7,"from":"seller"}',
        ),
        isA<NoticeFrame>().having(
          (f) => f.notice,
          'notice',
          const LiveMessageNotice('o1', 7, LiveSide.seller),
        ),
      );
    });

    test('ignores what is not a documented frame', () {
      expect(parseLiveFrame('not json'), isNull);
      expect(
        parseLiveFrame(
          '{"type":"message","orderId":"o1","seq":"7","from":"seller"}',
        ),
        isNull,
      );
      expect(parseLiveFrame('{"type":"other"}'), isNull);
      expect(parseLiveFrame([1]), isNull);
    });
  });

  group('reconnectDelay', () {
    test('backs off 1, 2, 4, 8, 16 and then 30 seconds', () {
      expect(
        [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          20,
        ].map((failures) => reconnectDelay(failures, () => 0.5).inSeconds),
        [1, 1, 2, 4, 8, 16, 30, 30],
      );
    });

    test('spreads the wait by a fifth either way', () {
      expect(reconnectDelay(1, () => 0).inMilliseconds, 800);
      expect(reconnectDelay(1, () => 1).inMilliseconds, 1200);
    });
  });

  group(LiveClient, () {
    test('subscribes with a minted ticket once open, and reports a sync '
        'when every topic is followed', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order, _seller], s.listen);
        async.flushMicrotasks();
        expect(s.minted.first, [_order, _seller]);

        s.last.open();
        expect(s.last.sent, [_subscribe(_order), _subscribe(_seller)]);

        s.last.receive({'type': 'subscribed', 'topic': _order});
        expect(s.events, isEmpty);
        s.last.receive({'type': 'subscribed', 'topic': _seller});
        expect(s.events, [const LiveSynced()]);
      });
    });

    test('passes notices on and treats resync as a sync', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'order', 'orderId': 'o1', 'status': 'ready'})
          ..receive({'type': 'seen', 'orderId': 'o1', 'by': 'seller', 'seq': 3})
          ..receive({'type': 'resync'});

        expect(s.events, [
          const LiveOrderNotice('o1', 'ready'),
          const LiveSeenNotice('o1', LiveSide.seller, 3),
          const LiveSynced(),
        ]);
      });
    });

    test('shares one connection between followers and mints a topic once', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client
          ..follow([_order], s.listen)
          ..follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order});

        expect(s.sockets, hasLength(1));
        expect(s.last.sent, hasLength(1));
        expect(s.minted, [
          [_order],
        ]);
      });
    });

    test('follows a topic added while it is open', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order});

        s.client.follow([_seller], s.listen);
        async.flushMicrotasks();

        expect(s.minted.last, [_seller]);
        expect(s.last.sent.last, _subscribe(_seller));
      });
    });

    test('reconnects after a drop with new tickets and subscribes again', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order});
        s.events.clear();

        s.last.drop();
        async.elapse(const Duration(seconds: 1));
        expect(s.sockets, hasLength(2));
        expect(s.minted, hasLength(2));

        s.last.open();
        expect(s.last.sent, [_subscribe(_order)]);
        s.last.receive({'type': 'subscribed', 'topic': _order});
        expect(s.events, [const LiveSynced()]);
        expect(s.client.polling, isFalse);
      });
    });

    test('mints again once for a refused ticket, and then gives up on it', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'refused'});
        async.flushMicrotasks();
        expect(s.minted, [
          [_order],
          [_order],
        ]);
        expect(s.last.sent, hasLength(2));

        s.last.receive({'type': 'refused'});
        async.flushMicrotasks();
        expect(s.minted, hasLength(2));
        expect(s.last.sent, hasLength(2));
      });
    });

    test('opens no connection when no ticket could be minted, '
        'and tries again later', () {
      fakeAsync((async) {
        var allowed = false;
        final s = _Setup(
          mint: (topics) async => allowed ? {topics.first: 'ticket'} : {},
        );
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        expect(s.sockets, isEmpty);

        allowed = true;
        async.elapse(const Duration(seconds: 1));
        expect(s.sockets, hasLength(1));
      });
    });

    test('polls after three failures to open and stops once a connection '
        'opens', () {
      fakeAsync((async) {
        final s = _Setup();
        var changes = 0;
        s.client
          ..onPollingChange(() => changes += 1)
          ..follow([_order], s.listen);
        async.flushMicrotasks();

        s.last.drop();
        expect(s.client.polling, isFalse);
        async.elapse(const Duration(seconds: 1));
        s.last.drop();
        async.elapse(const Duration(seconds: 2));
        expect(s.client.polling, isFalse);
        s.last.drop();
        expect(s.client.polling, isTrue);
        expect(changes, 1);

        async.elapse(const Duration(seconds: 4));
        s.last.open();
        expect(s.client.polling, isFalse);
        expect(changes, 2);
      });
    });

    test('opens a new connection for the wanted topics when it would pass '
        'twenty', () {
      fakeAsync((async) {
        final s = _Setup();
        final first = [for (var i = 0; i < 20; i++) 'order:a$i'];
        final stop = s.client.follow(first, s.listen);
        async.flushMicrotasks();
        s.last.open();
        for (final topic in first) {
          s.last.receive({'type': 'subscribed', 'topic': topic});
        }
        stop();

        s.client.follow(['order:b'], s.listen);
        async.flushMicrotasks();

        expect(s.sockets, hasLength(2));
        expect(s.sockets.first.closed, isTrue);
        expect(s.minted.last, ['order:b']);
      });
    });

    test('closes shortly after the last follower leaves, and not while it '
        'is followed again', () {
      fakeAsync((async) {
        final s = _Setup();
        final stop = s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last.open();

        stop();
        final again = s.client.follow([_order], s.listen);
        async.elapse(const Duration(seconds: 3));
        expect(s.last.closed, isFalse);

        again();
        async.elapse(const Duration(seconds: 3));
        expect(s.last.closed, isTrue);
      });
    });

    test('closes while paused and, once resumed, subscribes again and '
        'reports a sync', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order});
        s.events.clear();

        s.client.pause();
        expect(s.last.closed, isTrue);
        async.elapse(const Duration(minutes: 1));
        expect(s.sockets, hasLength(1));

        s.client.resume();
        async.flushMicrotasks();
        expect(s.sockets, hasLength(2));
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order});
        expect(s.last.sent, [_subscribe(_order)]);
        expect(s.events, [const LiveSynced()]);
      });
    });

    test('reconnects after the server ends a connection it held', () {
      fakeAsync((async) {
        final s = _Setup();
        s.client.follow([_order], s.listen);
        async.flushMicrotasks();
        s.last
          ..open()
          ..receive({'type': 'subscribed', 'topic': _order})
          // The server closes a connection after 30 minutes (4000).
          ..drop();
        async.elapse(const Duration(seconds: 1));
        expect(s.sockets, hasLength(2));
        expect(s.client.polling, isFalse);
      });
    });
  });
}
