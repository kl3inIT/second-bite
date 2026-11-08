import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
import 'package:second_bite/features/order/data/order_live.dart';
import 'package:second_bite/features/order/data/order_reader.dart';

part 'order_reads.g.dart';

/// The reader's orders: those still to collect and those that ended.
typedef MyOrders = ({List<OrderBody> open, List<OrderBody> ended});

/// An order as its page shows it, with the other stores' orders placed with
/// it from the same cart.
typedef OrderView = ({OrderBody order, List<OrderBody> together});

// A failure shows at once, as on the home, rather than behind retries.
Duration? _never(int retryCount, Object error) => null;

/// The reader's orders, the account's when someone is signed in and those
/// placed on this phone otherwise; null when neither, so the tab asks to
/// sign in (SEC-204 › design 3).
@Riverpod(retry: _never)
Future<MyOrders?> myOrders(Ref ref) async {
  final reader = ref.watch(orderReaderProvider);
  final account = await ref.watch(currentAccountProvider.future);
  return await reader.myOrders(signedIn: account != null);
}

/// [orderId] as its page shows it; null when there is no such order or it
/// is someone else's. It fails with [OrderUnknown] when no one is signed in
/// and the phone holds no access to it.
@Riverpod(retry: _never)
Future<OrderView?> orderView(Ref ref, String orderId) async {
  final reader = ref.watch(orderReaderProvider);
  final account = await ref.watch(currentAccountProvider.future);
  return await reader.order(orderId, signedIn: account != null);
}

/// {@template live_refresh}
/// Keeps an order's screen current (SEC-204 › design 5), as the web's
/// `LiveRefresh`: it follows the [orderIds]' topics on the app's live
/// socket and calls [onRefresh] 300 ms after a notice about one of them, or
/// a [LiveSynced] once the topics are subscribed again, so notices that
/// arrive together make one read. While the socket cannot open it reads
/// every 15 seconds, only while the app is in front; and a second after
/// each of [moments] still to come, such as a window opening or closing,
/// which changes what the screen shows without any notice. It also reads
/// when the app comes back to the foreground.
/// {@endtemplate}
class LiveRefresh extends ConsumerStatefulWidget {
  /// {@macro live_refresh}
  const new({
    required this.orderIds,
    required this.moments,
    required this.onRefresh,
    required this.child,
    super.key,
  });

  /// The orders followed.
  final List<String> orderIds;

  /// The moments after which the orders are read again.
  final List<DateTime> moments;

  /// Reads the orders again.
  final VoidCallback onRefresh;

  /// What is shown.
  final Widget child;

  @override
  ConsumerState<LiveRefresh> createState() => _LiveRefreshState();
}

/// Notices that arrive together make one read.
const _refreshDelay = Duration(milliseconds: 300);

/// While the socket is down, a screen reads its orders again this often.
const _poll = Duration(seconds: 15);

/// A screen that waits for a moment of a window reads just after it, once
/// the server reads it too.
const _afterMoment = Duration(seconds: 1);

class _LiveRefreshState extends ConsumerState<LiveRefresh> {
  late final LiveClient _client;
  late final AppLifecycleListener _lifecycle;
  late final void Function() _stopPolling;
  void Function()? _stopFollowing;
  final List<Timer> _moments = [];
  Timer? _debounce;
  Timer? _polling;

  @override
  void initState() {
    super.initState();
    _client = ref.read(liveClientProvider);
    _lifecycle = AppLifecycleListener(onResume: _refreshSoon);
    _stopPolling = _client.onPollingChange(_pollingChanged);
    _follow();
    _schedule();
    _pollingChanged();
  }

  @override
  void didUpdateWidget(LiveRefresh oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!listEquals(oldWidget.orderIds, widget.orderIds)) _follow();
    _schedule();
  }

  void _follow() {
    _stopFollowing?.call();
    _stopFollowing = widget.orderIds.isEmpty
        ? null
        : _client.follow([
            for (final id in widget.orderIds) orderTopic(id),
          ], _onEvent);
  }

  void _onEvent(LiveEvent event) {
    if (event is LiveNotice && !widget.orderIds.contains(event.orderId)) {
      return;
    }
    _refreshSoon();
  }

  void _refreshSoon() {
    _debounce?.cancel();
    _debounce = Timer(_refreshDelay, () {
      if (mounted) widget.onRefresh();
    });
  }

  void _pollingChanged() {
    _polling?.cancel();
    _polling = null;
    if (!_client.polling) return;
    _polling = Timer.periodic(_poll, (_) {
      final state = WidgetsBinding.instance.lifecycleState;
      if (mounted && (state == null || state == AppLifecycleState.resumed)) {
        widget.onRefresh();
      }
    });
  }

  void _schedule() {
    for (final timer in _moments) {
      timer.cancel();
    }
    _moments.clear();
    final now = DateTime.now();
    for (final moment in widget.moments) {
      final wait = moment.difference(now) + _afterMoment;
      if (wait > Duration.zero) {
        _moments.add(
          Timer(wait, () {
            if (mounted) widget.onRefresh();
          }),
        );
      }
    }
  }

  @override
  void dispose() {
    for (final timer in _moments) {
      timer.cancel();
    }
    _debounce?.cancel();
    _polling?.cancel();
    _stopPolling();
    _stopFollowing?.call();
    _lifecycle.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
