import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

part 'order_live.g.dart';

// What a topic is called on the live socket: `order:{id}` (docs/specs/
// platform.md); the customer's app follows only orders.
final _orderTopic = RegExp(r'^order:([\w-]{1,64})$');

/// A connection follows at most 20 topics.
const _maxTopics = 20;

/// The topic of [orderId]'s notices.
String orderTopic(String orderId) => 'order:$orderId';

/// Where the live socket answers: the API's origin with `ws` for `http`,
/// `wss` for `https`, and `/live` after its path, so production's
/// `https://secondbite.vadan.app/api` is `wss://…/api/live`, as the web
/// reaches it.
Uri liveUri(String origin) {
  final api = Uri.parse(origin);
  final path = api.path.endsWith('/') ? api.path : '${api.path}/';
  return api.replace(
    scheme: api.scheme == 'https' ? 'wss' : 'ws',
    path: '${path}live',
  );
}

/// Mints a ticket for each order topic the reader may follow, as the web's
/// live-tickets.ts does: the session goes as the Bearer token every call
/// carries, and an order placed without an account sends its kept access.
/// A topic the API refuses is left out. It runs at every (re)connection,
/// since a ticket works once.
Future<Map<String, String>> mintOrderTickets(
  OrdersClient orders,
  KeptOrders kept,
  List<String> topics,
) async {
  final ids = [
    for (final topic in topics.toSet().take(_maxTopics))
      ?_orderTopic.firstMatch(topic)?.group(1),
  ];
  final tickets = await [
    for (final id in ids)
      () async {
        try {
          final access = await kept.accessOf(id);
          final minted = await orders.createOrderLiveTicket(
            orderId: id,
            orderAccess: access,
          );
          return minted.ticket;
        } on Object {
          return null;
        }
      }(),
  ].wait;
  return {
    for (final (index, id) in ids.indexed) orderTopic(id): ?tickets[index],
  };
}

/// A [LiveSocket] over a [WebSocketChannel] to [url].
LiveSocket channelSocket(Uri url) {
  final channel = WebSocketChannel.connect(url);
  late final LiveSocket socket;
  var closed = false;
  void ended() {
    if (closed) return;
    closed = true;
    socket.onClose?.call();
  }

  socket = LiveSocket(
    send: (data) => channel.sink.add(data),
    close: () {
      closed = true;
      unawaited(channel.sink.close());
    },
  );
  unawaited(
    channel.ready.then((_) {
      if (!closed) socket.onOpen?.call();
    }, onError: (Object _) => ended()),
  );
  channel.stream.listen(
    (data) {
      if (!closed) socket.onMessage?.call(data);
    },
    onError: (Object _) => ended(),
    onDone: ended,
    cancelOnError: true,
  );
  return socket;
}

/// The app's one [LiveClient] (SEC-204 › design 5): it mints with the
/// app's client and the kept accesses, and is paused while the app is in
/// the background and resumed when it comes back.
@Riverpod(keepAlive: true)
LiveClient liveClient(Ref ref) {
  final client = LiveClient(
    url: () => liveUri(apiOrigin),
    mint: (topics) => mintOrderTickets(
      ref.read(apiProvider).orders,
      ref.read(keptOrdersProvider),
      topics,
    ),
    createSocket: channelSocket,
  );
  final lifecycle = AppLifecycleListener(
    onStateChange: (state) => switch (state) {
      AppLifecycleState.resumed => client.resume(),
      AppLifecycleState.hidden ||
      AppLifecycleState.paused ||
      AppLifecycleState.detached => client.pause(),
      AppLifecycleState.inactive => null,
    },
  );
  ref.onDispose(lifecycle.dispose);
  return client;
}
