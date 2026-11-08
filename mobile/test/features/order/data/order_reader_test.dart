import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/data/order_reader.dart';

import '../../../helpers/helpers.dart';

class _MockOrdersClient extends Mock implements OrdersClient;

class _MockKeptOrders extends Mock implements KeptOrders;

const _a = '00000000-0000-4000-8000-00000000000a';
const _b = '00000000-0000-4000-8000-00000000000b';
const _gone = '00000000-0000-4000-8000-00000000000c';

DioException _notFound() => DioException(
  requestOptions: RequestOptions(),
  response: Response(requestOptions: RequestOptions(), statusCode: 404),
);

void main() {
  group(OrderReader, () {
    late OrdersClient client;
    late KeptOrders kept;
    late OrderReader subject;

    setUp(() {
      client = _MockOrdersClient();
      kept = _MockKeptOrders();
      subject = OrderReader(client, kept);
    });

    void keep(List<KeptOrder> orders) {
      when(kept.read).thenAnswer((_) async => orders);
      when(() => kept.accessOf(any())).thenAnswer((invocation) async {
        final id = invocation.positionalArguments.first as String;
        for (final each in orders) {
          if (each.orderId == id) return each.access;
        }
        return null;
      });
    }

    void answer(String id, OrderBody? order) {
      when(
        () => client.getOrder(
          orderId: id,
          orderAccess: any(named: 'orderAccess'),
        ),
      ).thenAnswer((_) async => order ?? (throw _notFound()));
    }

    group('myOrders', () {
      test(
        'returns null when no one is signed in and nothing is kept',
        () async {
          keep(const []);

          expect(await subject.myOrders(signedIn: false), isNull);
        },
      );

      test('reads each kept order with its access, newest first, split open '
          'and ended, and leaves out one the server no longer finds', () async {
        keep(const [
          (orderId: _a, access: 'access-of-a-1234567'),
          (orderId: _gone, access: 'access-of-c-1234567'),
          (orderId: _b, access: 'access-of-b-1234567'),
        ]);
        answer(
          _a,
          sampleOrder(id: _a).copyWith(createdAt: DateTime.utc(2026, 10, 19)),
        );
        answer(
          _b,
          sampleOrder(id: _b).copyWith(
            status: OrderBodyStatus.collected,
            createdAt: DateTime.utc(2026, 10, 20),
          ),
        );
        answer(_gone, null);

        final lists = await subject.myOrders(signedIn: false);

        expect([for (final o in lists!.open) o.id], [_a]);
        expect([for (final o in lists.ended) o.id], [_b]);
        verify(
          () =>
              client.getOrder(orderId: _a, orderAccess: 'access-of-a-1234567'),
        ).called(1);
      });

      test("lists the account's orders when signed in", () async {
        when(() => client.listMyOrders(state: OrdersState.open, limit: 50))
            .thenAnswer(
              (_) async => OrdersOutputBody(orders: [sampleOrder(id: _a)]),
            );
        when(() => client.listMyOrders(state: OrdersState.ended, limit: 50))
            .thenAnswer((_) async => const OrdersOutputBody(orders: []));

        final lists = await subject.myOrders(signedIn: true);

        expect([for (final o in lists!.open) o.id], [_a]);
        verifyNever(kept.read);
      });
    });

    group('order', () {
      test('throws $OrderUnknown when signed out without the access', () async {
        keep(const []);

        expect(
          () => subject.order(_a, signedIn: false),
          throwsA(isA<OrderUnknown>()),
        );
      });

      test('returns null when the server answers 404', () async {
        keep(const [(orderId: _a, access: 'access-of-a-1234567')]);
        answer(_a, null);

        expect(await subject.order(_a, signedIn: false), isNull);
      });

      test('returns the order with the others of its cart', () async {
        keep(const [
          (orderId: _a, access: 'access-of-a-1234567'),
          (orderId: _b, access: 'access-of-b-1234567'),
        ]);
        answer(_a, sampleOrder(id: _a));
        answer(
          _b,
          sampleOrder(
            id: _b,
            sellerName: 'Quán kem',
          ).copyWith(createdAt: DateTime.utc(2026, 10, 19, 14)),
        );

        final view = await subject.order(_a, signedIn: false);

        expect(view!.order.id, _a);
        expect([for (final o in view.together) o.seller.name], ['Quán kem']);
      });
    });

    group('readChat', () {
      MessageBody message(int seq) => MessageBody(
        seq: seq,
        from: MessageBodyFrom.seller,
        text: 'm$seq',
        sentAt: DateTime.utc(2026, 10, 19, 14),
      );

      test(
        'reads every page after the given message, with the access',
        () async {
          const seen = SeenBody(customer: 0, seller: 0);
          when(
            () => client.listOrderMessages(
              orderId: _a,
              after: 4,
              limit: 100,
              orderAccess: 'access-of-a-1234567',
            ),
          ).thenAnswer(
            (_) async => MessagesOutputBody(
              messages: [for (var seq = 5; seq < 105; seq++) message(seq)],
              seen: seen,
              open: true,
            ),
          );
          when(
            () => client.listOrderMessages(
              orderId: _a,
              after: 104,
              limit: 100,
              orderAccess: 'access-of-a-1234567',
            ),
          ).thenAnswer(
            (_) async => MessagesOutputBody(
              messages: [message(105)],
              seen: seen,
              open: false,
            ),
          );

          final chat = await subject.readChat(
            _a,
            access: 'access-of-a-1234567',
            after: 4,
          );

          expect(chat.messages, hasLength(101));
          expect(chat.messages.last.seq, 105);
          expect(chat.open, isFalse);
        },
      );
    });
  });
}
