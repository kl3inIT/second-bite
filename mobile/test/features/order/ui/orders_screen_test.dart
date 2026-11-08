import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/features/order/ui/orders_screen.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(OrdersScreen, () {
    Future<void> pumpOrders(
      WidgetTester tester,
      MyOrders? lists, {
      String at = '/orders',
      LiveClient? live,
    }) {
      final router = GoRouter(
        initialLocation: at,
        routes: [
          GoRoute(
            path: '/orders',
            builder: (_, state) => OrdersScreen(
              ended: state.uri.queryParameters['state'] == 'ended',
            ),
            routes: [
              GoRoute(
                path: ':orderId',
                builder: (_, state) =>
                    Text('order ${state.pathParameters['orderId']}'),
              ),
            ],
          ),
          GoRoute(path: '/sign-in', builder: (_, _) => const Text('sign in')),
        ],
      );
      return tester.pumpRouterApp(
        router,
        live: live,
        overrides: [myOrdersProvider.overrideWith((ref) async => lists)],
      );
    }

    final now = DateTime.now();

    group('updates', () {
      testWidgets('follows the open orders on the live socket', (tester) async {
        final live = TestLiveClient();
        await pumpOrders(tester, (
          open: [
            sampleOrder(id: 'a'),
            sampleOrder(id: 'b'),
          ],
          ended: [sampleOrder(id: 'c')],
        ), live: live);
        await tester.pump();

        expect(live.topics, ['order:a', 'order:b']);
      });
    });

    group('renders', () {
      testWidgets('the way to sign in when no order is known', (tester) async {
        await pumpOrders(tester, null);
        await tester.pump();

        expect(find.byType(OrdersSignInPrompt), findsOneWidget);
        expect(find.text('Chưa thấy đơn nào'), findsOneWidget);
      });

      testWidgets('that nothing is to collect', (tester) async {
        await pumpOrders(tester, (open: const [], ended: const []));
        await tester.pump();

        expect(find.text('Đang chờ nhận (0)'), findsOneWidget);
        expect(find.text('Bạn chưa có đơn nào đang chờ nhận.'), findsOneWidget);
      });

      testWidgets('an order being prepared, and a ready one with its QR way', (
        tester,
      ) async {
        await pumpOrders(tester, (
          open: [
            sampleOrder(id: 'a').copyWith(lines: [sampleOrderLine()]),
            sampleOrder(
              id: 'b',
              number: 'SB-1002',
            ).copyWith(status: OrderBodyStatus.ready),
          ],
          ended: const [],
        ));
        await tester.pump();

        expect(find.text('Đang chờ nhận (2)'), findsOneWidget);
        expect(find.text('Đang chuẩn bị'), findsOneWidget);
        expect(find.text('Sẵn sàng · đến 21:45'), findsOneWidget);
        expect(find.text('#SB-1001 · 39.000đ · nhận 21:00–21:45'), findsOne);
        expect(find.text('Xem mã QR nhận món'), findsOneWidget);
        expect(find.text('Xem đơn'), findsOneWidget);
      });

      testWidgets('ended orders under their day, with what became of them', (
        tester,
      ) async {
        await pumpOrders(tester, at: '/orders?state=ended', (
          open: const [],
          ended: [
            sampleOrder(id: 'a').copyWith(
              status: OrderBodyStatus.cancelled,
              windowStart: now,
              lines: [sampleOrderLine()],
            ),
            sampleOrder(id: 'b').copyWith(
              status: OrderBodyStatus.expired,
              windowStart: now.subtract(const Duration(days: 30)),
              lines: [sampleOrderLine(name: 'Croissant')],
            ),
          ],
        ));
        await tester.pump();

        expect(find.text('Hôm nay'), findsOneWidget);
        expect(find.text('Trước đó'), findsOneWidget);
        expect(find.textContaining('Đã huỷ · không thu tiền'), findsOneWidget);
        expect(find.textContaining('Hết hạn, không đến nhận'), findsOneWidget);
      });

      testWidgets('that no order has ended yet', (tester) async {
        await pumpOrders(tester, at: '/orders?state=ended', (
          open: const [],
          ended: const [],
        ));
        await tester.pump();

        expect(find.text('Chưa có đơn nào đã xong.'), findsOneWidget);
      });
    });

    group('navigates', () {
      testWidgets("to an order's page from its card", (tester) async {
        await pumpOrders(tester, (
          open: [sampleOrder(id: 'a')],
          ended: const [],
        ));
        await tester.pump();

        await tester.tap(find.text('Xem đơn'));
        await tester.pumpAndSettle();

        expect(find.text('order a'), findsOneWidget);
      });

      testWidgets('to the ended orders from the segmented control', (
        tester,
      ) async {
        await pumpOrders(tester, (open: const [], ended: const []));
        await tester.pump();

        await tester.tap(find.text('Đã xong'));
        await tester.pumpAndSettle();

        expect(find.text('Chưa có đơn nào đã xong.'), findsOneWidget);
      });
    });
  });
}
