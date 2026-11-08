import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/live_client.dart';
import 'package:second_bite/features/order/data/order_reader.dart';
import 'package:second_bite/features/order/ui/chat_screen.dart';
import 'package:second_bite/features/order/ui/order_reads.dart';

import '../../../helpers/helpers.dart';

class _MockOrderReader extends Mock implements OrderReader;

const _id = '00000000-0000-4000-8000-000000000001';
const _access = 'abcdefghijklmnopqrstuv';

MessageBody _message(int seq, MessageBodyFrom from, String text) => MessageBody(
  seq: seq,
  from: from,
  text: text,
  sentAt: DateTime.parse('2026-10-19T21:05:00+07:00'),
);

MessagesOutputBody _chat(
  List<MessageBody> messages, {
  bool open = true,
  SeenBody seen = const SeenBody(customer: 0, seller: 0),
}) => MessagesOutputBody(messages: messages, seen: seen, open: open);

DioException _refused(String code) => DioException(
  requestOptions: RequestOptions(),
  response: Response(
    requestOptions: RequestOptions(),
    statusCode: 409,
    data: {
      'code': code,
      'detail': 'Đơn đã kết thúc.',
      'requestId': 'req-1',
      'status': 409,
      'title': 'Conflict',
      'type': 'about:blank',
    },
  ),
);

void main() {
  group(ChatScreen, () {
    late OrderReader reader;
    late TestLiveClient live;

    setUp(() {
      reader = _MockOrderReader();
      live = TestLiveClient();
      when(() => reader.markSeen(any(), any(), access: any(named: 'access')))
          .thenAnswer((_) async {});
    });

    OrderBody order() => sampleOrder().copyWith(
      lines: [sampleOrderLine()],
      // Still to collect for a day, so the chat does not lock on its own.
      windowEnd: DateTime.now().add(const Duration(days: 1)),
    );

    Future<void> pumpChat(WidgetTester tester) async {
      final router = GoRouter(
        initialLocation: '/orders/$_id/chat',
        routes: [
          GoRoute(
            path: '/orders/:orderId',
            builder: (_, _) => const Text('order'),
            routes: [
              GoRoute(
                path: 'chat',
                builder: (_, state) =>
                    ChatScreen(orderId: state.pathParameters['orderId']!),
              ),
            ],
          ),
        ],
      );
      await tester.pumpRouterApp(
        router,
        live: live,
        overrides: [
          orderViewProvider(_id).overrideWith(
            (ref) async => (order: order(), together: const <OrderBody>[]),
          ),
          orderReaderProvider.overrideWithValue(reader),
        ],
      );
      await tester.pump();
      await tester.pump();
      await tester.pump();
    }

    void answerChat(MessagesOutputBody chat, {int after = 0}) {
      when(() => reader.readChat(_id, access: _access, after: after))
          .thenAnswer((_) async => chat);
    }

    group('renders', () {
      testWidgets("the store's name, the order and the messages, the "
          "reader's seen", (tester) async {
        answerChat(
          _chat([
            _message(1, MessageBodyFrom.seller, 'Món đã sẵn sàng'),
            _message(2, MessageBodyFrom.customer, 'Mình đang tới'),
          ], seen: const SeenBody(customer: 1, seller: 2)),
        );
        await pumpChat(tester);

        expect(find.text('Tiệm bánh Pháp'), findsOneWidget);
        expect(find.text('Bánh mì bơ tỏi'), findsOneWidget);
        expect(find.text('Món đã sẵn sàng'), findsOneWidget);
        expect(find.text('Mình đang tới'), findsWidgets);
        expect(find.text('21:05 · Đã xem'), findsOneWidget);
        expect(find.text('Trả lời nhanh'), findsNothing);
        expect(find.byType(ActionChip), findsNWidgets(3));
      });

      testWidgets('the locked foot once the chat can only be read', (
        tester,
      ) async {
        answerChat(_chat(const [], open: false));
        await pumpChat(tester);

        expect(
          find.text('Đơn đã kết thúc, chỉ xem lại tin nhắn.'),
          findsOneWidget,
        );
        expect(find.byType(TextField), findsNothing);
      });
    });

    group('calls', () {
      testWidgets('markSeen up to the last message of the store', (
        tester,
      ) async {
        answerChat(_chat([_message(3, MessageBodyFrom.seller, 'Còn món nhé')]));
        await pumpChat(tester);

        verify(() => reader.markSeen(_id, 3, access: _access)).called(1);
      });

      testWidgets('sendMessage with a quick reply, shown once sent', (
        tester,
      ) async {
        answerChat(_chat(const []));
        when(
          () => reader.sendMessage(
            _id,
            'Mình đang tới',
            key: any(named: 'key'),
            access: _access,
          ),
        ).thenAnswer(
          (_) async => _message(1, MessageBodyFrom.customer, 'Mình đang tới'),
        );
        await pumpChat(tester);

        await tester.tap(find.widgetWithText(ActionChip, 'Mình đang tới'));
        await tester.pump();
        await tester.pump();

        expect(find.text('Mình đang tới'), findsWidgets);
        expect(find.text('21:05'), findsOneWidget);
      });

      testWidgets('sendMessage again with the same key after a failure', (
        tester,
      ) async {
        answerChat(_chat(const []));
        final keys = <String>[];
        var attempts = 0;
        when(
          () => reader.sendMessage(
            _id,
            'Cho mình 2 túi',
            key: any(named: 'key'),
            access: _access,
          ),
        ).thenAnswer((invocation) async {
          keys.add(invocation.namedArguments[#key] as String);
          attempts += 1;
          if (attempts == 1) {
            throw DioException(requestOptions: RequestOptions());
          }
          return _message(1, MessageBodyFrom.customer, 'Cho mình 2 túi');
        });
        await pumpChat(tester);

        await tester.enterText(find.byType(TextField), 'Cho mình 2 túi');
        await tester.pump();
        await tester.tap(find.byTooltip('Gửi tin nhắn'));
        await tester.pump();
        await tester.pump();
        expect(find.text('Chưa gửi được · '), findsOneWidget);

        await tester.tap(find.text('Gửi lại'));
        await tester.pump();
        await tester.pump();

        expect(find.text('Chưa gửi được · '), findsNothing);
        expect(keys, hasLength(2));
        expect(keys.first, keys.last);
      });

      testWidgets('nothing more once the store ended the chat', (tester) async {
        answerChat(_chat(const []));
        when(
          () => reader.sendMessage(
            _id,
            any(),
            key: any(named: 'key'),
            access: _access,
          ),
        ).thenThrow(_refused('ORDER_CHAT_CLOSED'));
        await pumpChat(tester);

        await tester.tap(find.widgetWithText(ActionChip, 'Mình đang tới'));
        await tester.pump();
        await tester.pump();

        expect(
          find.text('Đơn đã kết thúc, chỉ xem lại tin nhắn.'),
          findsOneWidget,
        );
      });
    });

    group('updates', () {
      testWidgets('reads what is new after a notice of the order', (
        tester,
      ) async {
        answerChat(_chat([_message(1, MessageBodyFrom.seller, 'Chào bạn')]));
        answerChat(
          _chat([_message(2, MessageBodyFrom.seller, 'Món đã sẵn sàng')]),
          after: 1,
        );
        await pumpChat(tester);
        expect(live.topics, ['order:$_id']);

        live.emit(const LiveMessageNotice(_id, 2, LiveSide.seller));
        await tester.pump();
        await tester.pump();

        expect(find.text('Chào bạn'), findsOneWidget);
        expect(find.text('Món đã sẵn sàng'), findsOneWidget);
      });

      testWidgets('reads every 5 seconds while the socket is down', (
        tester,
      ) async {
        answerChat(_chat(const []));
        await pumpChat(tester);

        live.polling = true;
        await tester.pump(const Duration(seconds: 5));
        await tester.pump();
        live.polling = false;

        // The first read, then one after 5 seconds.
        verify(() => reader.readChat(_id, access: _access)).called(2);
      });
    });
  });
}
