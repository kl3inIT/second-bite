import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/data/order_live.dart';

class _MockOrdersClient extends Mock implements OrdersClient;

class _MockKeptOrders extends Mock implements KeptOrders;

void main() {
  group('liveUri', () {
    test('turns https into wss and adds live after the path', () {
      expect(
        liveUri('https://secondbite.vadan.app/api').toString(),
        'wss://secondbite.vadan.app/api/live',
      );
    });

    test('turns http into ws for the stub backend', () {
      expect(
        liveUri('http://10.0.2.2:3190').toString(),
        'ws://10.0.2.2:3190/live',
      );
    });
  });

  group('mintOrderTickets', () {
    late OrdersClient orders;
    late KeptOrders kept;

    setUp(() {
      orders = _MockOrdersClient();
      kept = _MockKeptOrders();
      when(() => kept.accessOf('o1')).thenAnswer((_) async => 'access-of-o1');
      when(() => kept.accessOf(any(that: isNot('o1'))))
          .thenAnswer((_) async => null);
    });

    test('mints a ticket per order with its kept access, and leaves out '
        'the refused and what is not an order', () async {
      when(
        () => orders.createOrderLiveTicket(
          orderId: 'o1',
          orderAccess: 'access-of-o1',
        ),
      ).thenAnswer(
        (_) async =>
            LiveTicketOutputBody(expiresAt: DateTime(2026), ticket: 't1'),
      );
      when(() => orders.createOrderLiveTicket(orderId: 'o2'))
          .thenThrow(DioException(requestOptions: RequestOptions()));

      final tickets = await mintOrderTickets(orders, kept, [
        'order:o1',
        'order:o2',
        'seller:s1',
      ]);

      expect(tickets, {'order:o1': 't1'});
      verifyNever(() => orders.createOrderLiveTicket(orderId: 's1'));
    });
  });
}
