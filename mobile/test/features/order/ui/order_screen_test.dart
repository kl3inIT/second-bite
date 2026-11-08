import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/ui/order_actions.dart';
import 'package:second_bite/features/order/ui/order_chat.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';
import 'package:second_bite/features/order/ui/order_screen.dart';

import '../../../helpers/helpers.dart';

class _MockOrderReader extends Mock implements OrderReader;

const _id = '00000000-0000-4000-8000-000000000001';

void main() {
  group(OrderScreen, () {
    late OrderReader reader;

    setUpAll(() {
      registerFallbackValue(sampleOrder());
      registerFallbackValue(ReportOrderProblemRequestKind.missingItem);
    });

    setUp(() => reader = _MockOrderReader());

    Future<void> pumpOrder(
      WidgetTester tester,
      Future<OrderView?> Function() view, {
      LiveClient? live,
    }) async {
      tester.view.physicalSize = const Size(1170, 6000);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      final router = GoRouter(
        initialLocation: '/orders/$_id',
        routes: [
          GoRoute(
            path: '/orders',
            builder: (_, _) => const Text('orders'),
            routes: [
              GoRoute(
                path: ':orderId',
                builder: (_, state) =>
                    OrderScreen(orderId: state.pathParameters['orderId']!),
              ),
            ],
          ),
          GoRoute(path: '/', builder: (_, _) => const Text('home')),
          GoRoute(path: '/sign-in', builder: (_, _) => const Text('sign in')),
        ],
      );
      await tester.pumpRouterApp(
        router,
        live: live,
        overrides: [
          orderViewProvider(_id).overrideWith((ref) => view()),
          orderReaderProvider.overrideWithValue(reader),
        ],
      );
      await tester.pump();
      await tester.pump();
    }

    OrderBody order({OrderBodyStatus status = OrderBodyStatus.confirmed}) =>
        sampleOrder().copyWith(
          status: status,
          lines: [sampleOrderLine()],
          totalVnd: 30000,
          payVnd: 30000,
        );

    group('renders', () {
      testWidgets('a confirmed order with its window, no QR and cancelling', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (order: order(), together: const <OrderBody>[]),
        );

        expect(find.text('Đơn #SB-1001'), findsOneWidget);
        expect(find.text('Đã xác nhận · quán đang chuẩn bị'), findsOneWidget);
        expect(find.text('21:00 – 21:45'), findsOneWidget);
        expect(find.byType(QrImageView), findsNothing);
        expect(
          find.textContaining('Mã QR hiện khi món sẵn sàng'),
          findsOneWidget,
        );
        expect(find.byType(CancelOrder), findsOneWidget);
        expect(find.text('#SB-1001'), findsOneWidget);
      });

      testWidgets('a ready order with its QR and no cancelling', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.ready),
            together: [sampleOrder(id: 'other', sellerName: 'Quán kem')],
          ),
        );

        expect(find.text('Món đã sẵn sàng'), findsOneWidget);
        expect(find.byType(QrImageView), findsOneWidget);
        expect(find.byType(CancelOrder), findsNothing);
        expect(find.text('Cách nhận món'), findsOneWidget);
        expect(find.text('Cùng lần đặt: Quán kem'), findsOneWidget);
      });

      testWidgets('a collected order with what it saved and the rating', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.collected).copyWith(
              canReview: true,
              collectedAt: DateTime.parse('2026-10-19T21:20:00+07:00'),
            ),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Đã nhận món lúc 21:20'), findsOneWidget);
        expect(find.text('48.000đ'), findsWidgets);
        expect(find.byType(ReviewForm), findsOneWidget);
      });

      testWidgets('a rated order as a receipt with the rating given', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.collected).copyWith(
              collectedAt: DateTime.parse('2026-10-19T21:20:00+07:00'),
              review: ReviewBody(
                createdAt: DateTime.utc(2026, 10, 19, 15),
                stars: 4,
                tags: const ['good_quality'],
              ),
            ),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Đã nhận món lúc 21:20 · 19/10'), findsOneWidget);
        expect(find.byType(ReviewGiven), findsOneWidget);
        expect(find.text('Chất lượng tốt'), findsOneWidget);
        expect(find.text('Bạn đã nhận món'), findsOneWidget);
      });

      testWidgets('a cancelled order with its reason and the portions back', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.cancelled).copyWith(
              cancelledAt: DateTime.parse('2026-10-19T20:30:00+07:00'),
              cancelReason: 'Đặt nhầm',
            ),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Đơn đã huỷ'), findsOneWidget);
        expect(find.text('20:30 · Đặt nhầm'), findsOneWidget);
        expect(find.text('2 phần đã trả lại cho quán'), findsOneWidget);
        expect(find.text('Không thu tiền'), findsOneWidget);
      });

      testWidgets("a refused order with the store's reason", (tester) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.refused).copyWith(
              refusedAt: DateTime.parse('2026-10-19T21:05:00+07:00'),
              refuseReason: OrderBodyRefuseReason.soldOut,
            ),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Quán không giao đơn này'), findsOneWidget);
        expect(find.text('21:05 · lý do: món đã hết'), findsOneWidget);
      });

      testWidgets('an expired order, and the way to report a problem', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.expired)
                .copyWith(canReportProblem: true),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Đơn đã hết hạn'), findsOneWidget);
        expect(find.text('21:45 · đơn ghi là không nhận'), findsOneWidget);
        expect(find.text('Báo vấn đề với đơn'), findsOneWidget);
      });

      testWidgets('the way to sign in for an order this phone does not hold', (
        tester,
      ) async {
        await pumpOrder(tester, () async => throw const OrderUnknown());

        expect(find.byType(OrdersSignInPrompt), findsOneWidget);
      });

      testWidgets("the store's unread message and the way to the chat", (
        tester,
      ) async {
        when(() => reader.readChat(_id, access: 'abcdefghijklmnopqrstuv'))
            .thenAnswer(
              (_) async => MessagesOutputBody(
                messages: [
                  MessageBody(
                    seq: 1,
                    from: MessageBodyFrom.seller,
                    text: 'Quán giữ món tới 21:45 nhé',
                    sentAt: DateTime.parse('2026-10-19T21:05:00+07:00'),
                  ),
                ],
                seen: const SeenBody(customer: 0, seller: 0),
                open: true,
              ),
            );
        await pumpOrder(
          tester,
          () async => (
            order: order().copyWith(unreadMessages: 1, messageCount: 1),
            together: const <OrderBody>[],
          ),
        );
        await tester.pump();

        expect(find.text('Quán vừa nhắn'), findsOneWidget);
        expect(find.text('“Quán giữ món tới 21:45 nhé”'), findsOneWidget);
        expect(find.byType(ChatEntry), findsOneWidget);
        expect(find.text('Nhắn quán'), findsOneWidget);
        expect(find.byType(AppUnreadPill), findsOneWidget);
      });

      testWidgets('the way to read the messages of an ended order', (
        tester,
      ) async {
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.expired)
                .copyWith(messageCount: 2),
            together: const <OrderBody>[],
          ),
        );

        expect(find.text('Xem tin nhắn'), findsOneWidget);
      });
    });

    group('calls', () {
      testWidgets('cancel with the reason chosen', (tester) async {
        when(() => reader.cancel(any(), reason: any(named: 'reason')))
            .thenAnswer((_) async => order(status: OrderBodyStatus.cancelled));
        await pumpOrder(
          tester,
          () async => (order: order(), together: const <OrderBody>[]),
        );

        await tester.tap(find.text('Huỷ đơn'));
        await tester.pumpAndSettle();
        expect(find.text('Huỷ đơn #SB-1001?'), findsOneWidget);
        await tester.tap(find.text('Đặt nhầm'));
        await tester.pump();
        await tester.tap(find.widgetWithText(AppButton, 'Huỷ đơn').last);
        await tester.pumpAndSettle();

        verify(() => reader.cancel(any(), reason: 'Đặt nhầm')).called(1);
      });

      testWidgets('review only once a star is chosen', (tester) async {
        when(
          () => reader.review(
            any(),
            stars: any(named: 'stars'),
            tags: any(named: 'tags'),
            comment: any(named: 'comment'),
          ),
        ).thenAnswer((_) async => order(status: OrderBodyStatus.collected));
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.collected)
                .copyWith(canReview: true),
            together: const <OrderBody>[],
          ),
        );

        await tester.tap(find.text('Gửi đánh giá'));
        await tester.pump();
        expect(find.text('Chọn số sao cho đơn.'), findsOneWidget);

        await tester.tap(find.bySemanticsLabel('4 sao · Tốt'));
        await tester.tap(find.text('Nhận hàng nhanh'));
        await tester.pump();
        await tester.tap(find.text('Gửi đánh giá'));
        await tester.pump();

        verify(
          () => reader.review(
            any(),
            stars: 4,
            tags: [ReviewOrderRequestTags.fastPickup],
            comment: any(named: 'comment'),
          ),
        ).called(1);
      });

      testWidgets('reportProblem only once a kind is chosen', (tester) async {
        when(
          () => reader.reportProblem(
            any(),
            kind: any(named: 'kind'),
            note: any(named: 'note'),
          ),
        ).thenAnswer((_) async => order(status: OrderBodyStatus.expired));
        await pumpOrder(
          tester,
          () async => (
            order: order(status: OrderBodyStatus.expired)
                .copyWith(canReportProblem: true),
            together: const <OrderBody>[],
          ),
        );

        await tester.tap(find.text('Báo vấn đề với đơn'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('Gửi cho quán'));
        await tester.pump();
        expect(find.text('Chọn điều chưa ổn với đơn.'), findsOneWidget);

        await tester.tap(find.text('Thiếu món'));
        await tester.pump();
        await tester.tap(find.text('Gửi cho quán'));
        await tester.pumpAndSettle();

        verify(
          () => reader.reportProblem(
            any(),
            kind: ReportOrderProblemRequestKind.missingItem,
            note: any(named: 'note'),
          ),
        ).called(1);
      });
    });

    group('updates', () {
      late TestLiveClient live;
      late int reads;

      setUp(() {
        live = TestLiveClient();
        reads = 0;
      });

      Future<OrderView?> view() async {
        reads += 1;
        return (
          order: order(
            status: reads > 1
                ? OrderBodyStatus.ready
                : OrderBodyStatus.confirmed,
          ),
          together: const <OrderBody>[],
        );
      }

      testWidgets('follows its order on the live socket', (tester) async {
        await pumpOrder(tester, view, live: live);

        expect(live.topics, ['order:$_id']);
      });

      testWidgets('reads the order again on a notice about it', (tester) async {
        await pumpOrder(tester, view, live: live);
        expect(find.byType(QrImageView), findsNothing);

        live.emit(const LiveOrderNotice(_id, 'ready'));
        await tester.pump(const Duration(milliseconds: 300));
        await tester.pump();
        await tester.pump();

        expect(reads, 2);
        expect(find.byType(QrImageView), findsOneWidget);
      });

      testWidgets('ignores a notice about another order', (tester) async {
        await pumpOrder(tester, view, live: live);

        live.emit(const LiveOrderNotice('other', 'ready'));
        await tester.pump(const Duration(milliseconds: 300));
        await tester.pump();

        expect(reads, 1);
      });

      testWidgets('reads the order every 15 seconds while the socket is down', (
        tester,
      ) async {
        await pumpOrder(tester, view, live: live);

        live.polling = true;
        await tester.pump(const Duration(seconds: 15));
        await tester.pump();

        expect(reads, 2);
        live.polling = false;
      });
    });
  });
}
