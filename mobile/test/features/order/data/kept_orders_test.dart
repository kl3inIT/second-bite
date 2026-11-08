import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';

class _MockStorage extends Mock implements FlutterSecureStorage;

String _id(int n) => '00000000-0000-4000-8000-${n.toString().padLeft(12, '0')}';

const _access = 'abcdefghijklmnop';

void main() {
  group(KeptOrders, () {
    late FlutterSecureStorage storage;
    late KeptOrders kept;
    String? stored;

    setUp(() {
      storage = _MockStorage();
      stored = null;
      when(() => storage.read(key: any(named: 'key')))
          .thenAnswer((_) async => stored);
      when(
        () => storage.write(
          key: any(named: 'key'),
          value: any(named: 'value'),
        ),
      ).thenAnswer((invocation) async {
        stored = invocation.namedArguments[#value] as String?;
      });
      kept = KeptOrders(storage);
    });

    test('keeps the newest order first, once', () async {
      await kept.keep(_id(1), _access);
      await kept.keep(_id(2), '${_access}2');
      await kept.keep(_id(1), _access);

      expect((await kept.read()).map((each) => each.orderId), [_id(1), _id(2)]);
      expect(await kept.accessOf(_id(2)), '${_access}2');
    });

    test('keeps at most $maxKeptOrders, dropping the oldest', () async {
      for (var n = 1; n <= maxKeptOrders + 2; n++) {
        await kept.keep(_id(n), _access);
      }
      final orders = await kept.read();

      expect(orders, hasLength(maxKeptOrders));
      expect(orders.first.orderId, _id(maxKeptOrders + 2));
      expect(await kept.accessOf(_id(1)), isNull);
    });

    test('keeps nothing that is not an order and an access', () async {
      await kept.keep('not-an-id', _access);
      await kept.keep(_id(1), 'short');

      expect(await kept.read(), isEmpty);
    });

    test('reads nothing from a store holding anything else', () {
      expect(readKeptOrders('{'), isEmpty);
      expect(readKeptOrders('{"a":1}'), isEmpty);
      expect(
        readKeptOrders(
          jsonEncode([
            [_id(1), _access],
            ['x', _access],
            [_id(2)],
          ]),
        ).map((each) => each.orderId),
        [_id(1)],
      );
    });

    test('reads nothing when the store cannot be read', () async {
      when(() => storage.read(key: any(named: 'key')))
          .thenThrow(Exception('locked'));

      expect(await kept.read(), isEmpty);
    });
  });
}
