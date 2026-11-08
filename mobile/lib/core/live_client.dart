import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/foundation.dart';

// The app's side of `GET /live` (SEC-117 › docs/specs/platform.md › The live
// socket; SEC-204 › design 5), ported from the web's
// web/src/lib/live-client.ts: one connection for the app, which follows any
// topics the screens ask for and passes their notices on. It holds no widget
// and reads no clock but the timers, so its reconnecting, its resubscribing
// and its fallback are tested with a fake socket and fake time.

/// Who wrote or saw a message.
enum LiveSide {
  /// The customer of the order.
  customer,

  /// The seller's people.
  seller,
}

/// What reaches a follower: a notice of what changed, or [LiveSynced].
@immutable
sealed class LiveEvent {
  const new();
}

/// The followed topics were (re)subscribed or the server sent `resync`, so
/// a screen reads its state again (SEC-117 design decision 12).
@immutable
final class LiveSynced extends LiveEvent {
  /// The topics were (re)subscribed.
  const new();

  @override
  bool operator ==(Object other) => other is LiveSynced;

  @override
  int get hashCode => 0;
}

/// A notice about one order: identifiers and numbers, never a text (SEC-117
/// design decision 10).
@immutable
sealed class LiveNotice extends LiveEvent {
  const new(this.orderId);

  /// The order the notice is about.
  final String orderId;
}

/// An order's status changed.
@immutable
final class LiveOrderNotice extends LiveNotice {
  /// [orderId] is now [status].
  const new(super.orderId, this.status);

  /// The order's status, as the API names it.
  final String status;

  @override
  bool operator ==(Object other) =>
      other is LiveOrderNotice &&
      other.orderId == orderId &&
      other.status == status;

  @override
  int get hashCode => Object.hash(orderId, status);
}

/// A message was written in an order's chat.
@immutable
final class LiveMessageNotice extends LiveNotice {
  /// Message [seq] of [orderId] was written by [from].
  const new(super.orderId, this.seq, this.from);

  /// The message's number in the chat.
  final int seq;

  /// Who wrote it.
  final LiveSide from;

  @override
  bool operator ==(Object other) =>
      other is LiveMessageNotice &&
      other.orderId == orderId &&
      other.seq == seq &&
      other.from == from;

  @override
  int get hashCode => Object.hash(orderId, seq, from);
}

/// One side read an order's chat up to a message.
@immutable
final class LiveSeenNotice extends LiveNotice {
  /// [by] has read [orderId]'s chat up to [seq].
  const new(super.orderId, this.by, this.seq);

  /// Who read it.
  final LiveSide by;

  /// The last message read.
  final int seq;

  @override
  bool operator ==(Object other) =>
      other is LiveSeenNotice &&
      other.orderId == orderId &&
      other.by == by &&
      other.seq == seq;

  @override
  int get hashCode => Object.hash(orderId, by, seq);
}

/// {@template live_socket}
/// The part of a WebSocket the client uses: it sends and closes, and the
/// connection behind it calls [onOpen], [onMessage] and [onClose], which
/// the client sets. A test builds one over its own lists.
/// {@endtemplate}
class LiveSocket {
  /// {@macro live_socket}
  new({required this.send, required this.close});

  /// Sends a text frame.
  final void Function(String data) send;

  /// Closes the connection; [onClose] is not called after it.
  final void Function() close;

  /// The connection opened.
  void Function()? onOpen;

  /// A frame arrived.
  void Function(Object? data)? onMessage;

  /// The connection closed, or failed to open.
  void Function()? onClose;
}

/// A frame the server sent: one of the documented frames.
sealed class LiveFrame {
  const new();
}

/// The server follows [topic] now.
final class SubscribedFrame extends LiveFrame {
  /// The server follows [topic] now.
  const new(this.topic);

  /// The topic.
  final String topic;
}

/// The server refused the oldest subscribe frame not yet answered.
final class RefusedFrame extends LiveFrame {
  /// The server refused a ticket.
  const new();
}

/// The server lost notices, so the screens read again.
final class ResyncFrame extends LiveFrame {
  /// Read again.
  const new();
}

/// A notice.
final class NoticeFrame extends LiveFrame {
  /// A notice.
  const new(this.notice);

  /// What changed.
  final LiveNotice notice;
}

/// A frame the server sent, or null for text that is not one of the
/// documented frames.
LiveFrame? parseLiveFrame(Object? data) {
  if (data is! String) return null;
  final Object? json;
  try {
    json = jsonDecode(data);
  } on FormatException {
    return null;
  }
  if (json is! Map<String, Object?>) return null;
  LiveSide? sideOf(Object? value) => switch (value) {
    'customer' => LiveSide.customer,
    'seller' => LiveSide.seller,
    _ => null,
  };
  return switch (json) {
    {'type': 'subscribed', 'topic': final String topic} => SubscribedFrame(
      topic,
    ),
    {'type': 'refused'} => const RefusedFrame(),
    {'type': 'resync'} => const ResyncFrame(),
    {
      'type': 'order',
      'orderId': final String orderId,
      'status': final String status,
    } =>
      NoticeFrame(LiveOrderNotice(orderId, status)),
    {
      'type': 'message',
      'orderId': final String orderId,
      'seq': final int seq,
      'from': final Object? from,
    }
        when sideOf(from) != null =>
      NoticeFrame(LiveMessageNotice(orderId, seq, sideOf(from)!)),
    {
      'type': 'seen',
      'orderId': final String orderId,
      'seq': final int seq,
      'by': final Object? by,
    }
        when sideOf(by) != null =>
      NoticeFrame(LiveSeenNotice(orderId, sideOf(by)!, seq)),
    _ => null,
  };
}

/// A connection follows at most 20 topics, and the server closes one that
/// asks for a 41st frame.
const _maxTopics = 20;

/// The wait before reconnecting after the 1st, 2nd… failure to open; the
/// last repeats (SEC-117 design decision 13).
const _backoffSeconds = [1, 2, 4, 8, 16, 30];

/// After this many failures in a row the screens poll until a connection
/// opens (SEC-117 design decision 29).
const _pollAfterFailures = 3;

/// How long the connection stays after its last follower leaves, so moving
/// between screens keeps it.
const _idleClose = Duration(seconds: 2);

/// The wait is spread by this much either way, so phones that lost the
/// server together do not return together.
const _jitter = 0.2;

/// The wait before the next attempt after [failures] failures in a row.
Duration reconnectDelay(int failures, double Function() random) {
  final index = (failures - 1).clamp(0, _backoffSeconds.length - 1);
  final seconds = _backoffSeconds[index];
  final ms = seconds * 1000 * (1 + (random() * 2 - 1) * _jitter);
  return Duration(milliseconds: ms.round());
}

/// One ticket for each topic it may follow, minted for one connection; a
/// topic left out is not followed.
typedef LiveMint = Future<Map<String, String>> Function(List<String> topics);

class _Follower {
  new(this.listener);

  final void Function(LiveEvent event) listener;
}

/// {@template live_client}
/// The app's one connection to `GET /live`: it opens when a screen first
/// follows a topic, mints a ticket per topic at each connection, sends the
/// subscribe frames, hands every notice to every follower, reconnects after
/// 1, 2, 4, 8, 16 and then 30 seconds, says [polling] after three failures
/// in a row, and closes two seconds after the last follower leaves. Unlike
/// a browser tab, an app is paused in the background: [pause] closes the
/// connection and [resume] opens it again, whose subscriptions then report
/// [LiveSynced] so the screens read again (SEC-204 › design 5).
/// {@endtemplate}
class LiveClient {
  /// {@macro live_client}
  new({
    required this._url,
    required this._mint,
    required this._createSocket,
    double Function()? random,
  }) : _random = random ?? Random().nextDouble;

  final Uri Function() _url;
  final LiveMint _mint;
  final LiveSocket Function(Uri url) _createSocket;
  final double Function() _random;

  /// The topics followed and how many followers each has.
  final Map<String, int> _topics = {};
  final Set<_Follower> _followers = {};
  final Set<void Function()> _statusListeners = {};
  final Set<String> _subscribed = {};

  /// The topics a subscribe frame was sent for and the server has not
  /// answered, in the order sent.
  List<String> _pending = [];

  /// The topics whose ticket was refused and minted again once on this
  /// connection.
  final Set<String> _retried = {};
  LiveSocket? _socket;

  /// Counts connections, so what a stale one reports is ignored.
  int _generation = 0;
  bool _connecting = false;
  int _failures = 0;
  bool _polling = false;
  bool _paused = false;
  Timer? _retry;
  Timer? _idle;

  /// Whether the connection has failed to open several times, so the
  /// screens poll instead.
  bool get polling => _polling;

  /// Calls [listener] when [polling] changes; returns the way to stop.
  void Function() onPollingChange(void Function() listener) {
    _statusListeners.add(listener);
    return () => _statusListeners.remove(listener);
  }

  /// Follows [topics] and hands every notice of the connection to
  /// [listener], which filters what concerns it. Returns the way to stop;
  /// the connection closes shortly after its last follower leaves.
  void Function() follow(
    List<String> topics,
    void Function(LiveEvent event) listener,
  ) {
    final follower = _Follower(listener);
    final own = topics.toSet().toList();
    _followers.add(follower);
    for (final topic in own) {
      _topics[topic] = (_topics[topic] ?? 0) + 1;
    }
    _idle?.cancel();
    _idle = null;
    _wake();

    return () {
      if (!_followers.remove(follower)) return;
      for (final topic in own) {
        final left = (_topics[topic] ?? 1) - 1;
        if (left > 0) {
          _topics[topic] = left;
        } else {
          _topics.remove(topic);
        }
      }
      if (_topics.isEmpty) _idle = Timer(_idleClose, _stop);
    };
  }

  /// Closes the connection while the app is in the background, keeping the
  /// topics followed.
  void pause() {
    if (_paused) return;
    _paused = true;
    _close();
    _retry?.cancel();
    _retry = null;
  }

  /// Opens the connection again when the app returns, for the topics still
  /// followed; once subscribed, the followers hear [LiveSynced].
  void resume() {
    if (!_paused) return;
    _paused = false;
    _wake();
  }

  List<String> _wanted() => _topics.keys.take(_maxTopics).toList();

  void _emit(LiveEvent event) {
    for (final follower in _followers.toList()) {
      follower.listener(event);
    }
  }

  void _setPolling(bool polling) {
    if (_polling == polling) return;
    _polling = polling;
    for (final listener in _statusListeners.toList()) {
      listener();
    }
  }

  void _wake() {
    if (_paused) return;
    if (_socket != null) {
      _subscribeMissing();
    } else if (!_connecting && _retry == null && _topics.isNotEmpty) {
      unawaited(_connect());
    }
  }

  Future<void> _connect() async {
    final generation = ++_generation;
    _connecting = true;
    var tickets = <String, String>{};
    try {
      tickets = await _mint(_wanted());
    } on Object {
      // A failed mint is a failed attempt, counted below.
    }
    if (generation != _generation) return;
    _connecting = false;
    if (tickets.isEmpty) {
      _failed();
      return;
    }

    final socket = _createSocket(_url());
    _socket = socket;
    var opened = false;
    socket
      ..onOpen = () {
        if (generation != _generation) return;
        opened = true;
        _failures = 0;
        _setPolling(false);
        _subscribe(tickets);
        _subscribeMissing();
      }
      ..onMessage = (data) {
        if (generation == _generation) _receive(data);
      }
      ..onClose = () {
        if (generation != _generation) return;
        _socket = null;
        _reset();
        // A connection that was followed and then closed starts again from
        // the first wait; one that never opened counts as a failure.
        if (opened) {
          _reconnect();
        } else {
          _failed();
        }
      };
  }

  /// Sends a subscribe frame for each topic that has a ticket.
  void _subscribe(Map<String, String> tickets) {
    for (final MapEntry(key: topic, value: ticket) in tickets.entries) {
      if (!_topics.containsKey(topic) ||
          _subscribed.contains(topic) ||
          _pending.contains(topic)) {
        continue;
      }
      _socket?.send(jsonEncode({'type': 'subscribe', 'ticket': ticket}));
      _pending.add(topic);
    }
  }

  /// Mints and sends what the followers want and the connection does not
  /// follow yet.
  void _subscribeMissing() {
    final generation = _generation;
    final missing = _wanted()
        .where(
          (topic) => !_subscribed.contains(topic) && !_pending.contains(topic),
        )
        .toList();
    if (missing.isEmpty || _socket == null) return;
    // The server has no frame to stop following, so topics left behind by
    // screens that went away hold their places until the next connection;
    // one made now carries only the wanted ones.
    if (_subscribed.length + _pending.length + missing.length > _maxTopics) {
      _recycle();
      return;
    }
    unawaited(
      _mint(missing).then((tickets) {
        if (generation == _generation) _subscribe(tickets);
      }, onError: (Object _) {}),
    );
  }

  void _receive(Object? data) {
    switch (parseLiveFrame(data)) {
      case SubscribedFrame(:final topic):
        _pending = _pending.where((each) => each != topic).toList();
        _subscribed.add(topic);
        if (_pending.isEmpty) _emit(const LiveSynced());
      case RefusedFrame():
        if (_pending.isEmpty) return;
        final topic = _pending.removeAt(0);
        // Mint once more for a ticket that was used or had expired, and no
        // more: each frame counts against the 40 the server allows.
        if (_topics.containsKey(topic) && _retried.add(topic)) {
          final generation = _generation;
          unawaited(
            _mint([topic]).then((tickets) {
              if (generation == _generation) _subscribe(tickets);
            }, onError: (Object _) {}),
          );
        }
      case ResyncFrame():
        _emit(const LiveSynced());
      case NoticeFrame(:final notice):
        _emit(notice);
      case null:
        return;
    }
  }

  void _reset() {
    _subscribed.clear();
    _pending = [];
    _retried.clear();
  }

  void _failed() {
    _failures += 1;
    if (_failures >= _pollAfterFailures) _setPolling(true);
    _reconnect();
  }

  void _reconnect() {
    _retry?.cancel();
    _retry = null;
    if (_topics.isEmpty || _paused) return;
    _retry = Timer(reconnectDelay(_failures, _random), () {
      _retry = null;
      unawaited(_connect());
    });
  }

  /// Closes the connection and opens a new one at once, for the topics
  /// wanted now.
  void _recycle() {
    _close();
    unawaited(_connect());
  }

  void _close() {
    _generation += 1;
    _connecting = false;
    final socket = _socket;
    _socket = null;
    _reset();
    if (socket != null) {
      socket
        ..onOpen = null
        ..onMessage = null
        ..onClose = null;
      socket.close();
    }
  }

  void _stop() {
    _idle = null;
    _close();
    _retry?.cancel();
    _retry = null;
    _failures = 0;
    _setPolling(false);
  }
}
