import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';
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

/// {@template order_refresh}
/// Reads the orders again while there is no live socket in the app yet
/// (SEC-204 step 11 replaces it): when the app comes back to the
/// foreground, and a second after each of [moments] still to come, such as
/// a window opening or closing, as the web's `LiveRefresh` does at each
/// window's end. [onRefresh] reads them again.
/// {@endtemplate}
class OrderRefresh extends StatefulWidget {
  /// {@macro order_refresh}
  const new({
    required this.moments,
    required this.onRefresh,
    required this.child,
    super.key,
  });

  /// The moments after which the orders are read again.
  final List<DateTime> moments;

  /// Reads the orders again.
  final VoidCallback onRefresh;

  /// What is shown.
  final Widget child;

  @override
  State<OrderRefresh> createState() => _OrderRefreshState();
}

class _OrderRefreshState extends State<OrderRefresh> {
  late final AppLifecycleListener _lifecycle;
  final List<Timer> _timers = [];

  @override
  void initState() {
    super.initState();
    _lifecycle = AppLifecycleListener(onResume: () => widget.onRefresh());
    _schedule();
  }

  @override
  void didUpdateWidget(OrderRefresh oldWidget) {
    super.didUpdateWidget(oldWidget);
    _schedule();
  }

  void _schedule() {
    for (final timer in _timers) {
      timer.cancel();
    }
    _timers.clear();
    final now = DateTime.now();
    for (final moment in widget.moments) {
      final wait = moment.difference(now) + const Duration(seconds: 1);
      if (wait > Duration.zero) {
        _timers.add(Timer(wait, () => widget.onRefresh()));
      }
    }
  }

  @override
  void dispose() {
    for (final timer in _timers) {
      timer.cancel();
    }
    _lifecycle.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
