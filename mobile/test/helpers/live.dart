import 'package:second_bite/core/live_client.dart';

/// {@template test_live_client}
/// A [LiveClient] that opens no connection: a test hands its followers a
/// notice with [emit] and says whether the socket is down with [polling].
/// {@endtemplate}
class TestLiveClient extends LiveClient {
  /// {@macro test_live_client}
  new()
    : super(
        url: () => Uri.parse('ws://test/live'),
        mint: (_) async => const {},
        createSocket: (_) => throw UnsupportedError('no socket in tests'),
      );

  final List<(List<String>, void Function(LiveEvent))> _followers = [];
  final Set<void Function()> _listeners = {};
  bool _polling = false;

  /// The topics followed now.
  List<String> get topics => [for (final (topics, _) in _followers) ...topics];

  @override
  bool get polling => _polling;

  /// Says whether the socket is down, so screens poll.
  set polling(bool value) {
    _polling = value;
    for (final listener in _listeners.toList()) {
      listener();
    }
  }

  @override
  void Function() onPollingChange(void Function() listener) {
    _listeners.add(listener);
    return () => _listeners.remove(listener);
  }

  @override
  void Function() follow(
    List<String> topics,
    void Function(LiveEvent event) listener,
  ) {
    final follower = (topics, listener);
    _followers.add(follower);
    return () => _followers.remove(follower);
  }

  /// Hands [event] to every follower.
  void emit(LiveEvent event) {
    for (final (_, listener) in _followers.toList()) {
      listener(event);
    }
  }
}
