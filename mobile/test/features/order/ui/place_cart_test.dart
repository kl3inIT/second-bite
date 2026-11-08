import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/data/order_repository.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/domain/contact.dart';
import 'package:second_bite/features/order/ui/place_cart.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

class _MockOrderRepository extends Mock implements OrderRepository;

class _MockKeptOrders extends Mock implements KeptOrders;

const Contact _contact = (name: 'Minh Anh', phone: '0900000000');

DioException _refused(String code, {String detail = 'Không đặt được.'}) =>
    DioException(
      requestOptions: RequestOptions(),
      response: Response(
        requestOptions: RequestOptions(),
        statusCode: 409,
        data: <String, Object?>{
          'code': code,
          'detail': detail,
          'requestId': 'req-1',
          'status': 409,
          'title': 'Conflict',
          'type': 'urn:secondbite:failure:order',
        },
      ),
    );

void main() {
  group(PlaceCart, () {
    late OrderRepository orders;
    late KeptOrders kept;
    late ProviderContainer container;
    final bread = sampleOffer(sellerId: 'se-1');
    final cake = sampleOffer(id: 'of-cake', name: 'Bánh kem', sellerId: 'se-2');

    setUpAll(() {
      registerFallbackValue(
        const Basket(
          seller: OfferSellerBody(address: '', id: '', name: ''),
          collectionPoint: CollectionPointBody(
            latitude: 0,
            longitude: 0,
            address: '',
          ),
          lines: [],
        ),
      );
      registerFallbackValue(_contact);
    });

    setUp(() async {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
      orders = _MockOrderRepository();
      kept = _MockKeptOrders();
      when(() => kept.keep(any(), any())).thenAnswer((_) async {});
      container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(orders),
          keptOrdersProvider.overrideWithValue(kept),
        ],
      );
      addTearDown(container.dispose);
      container.listen(placeCartProvider, (_, _) {});
      final cart = container.read(keptCartProvider.notifier);
      await cart.addOne(bread);
      await cart.addOne(cake);
    });

    Future<Cart> cart() async {
      final kept = await container.read(keptCartProvider.future);
      return kept!;
    }

    test('places each store, keeps each access and empties the cart', () async {
      final keys = <String>[];
      final checkouts = <String>{};
      when(
        () => orders.place(
          any(),
          any(),
          idempotencyKey: any(named: 'idempotencyKey'),
          checkoutId: any(named: 'checkoutId'),
        ),
      ).thenAnswer((invocation) async {
        keys.add(invocation.namedArguments[#idempotencyKey] as String);
        checkouts.add(invocation.namedArguments[#checkoutId] as String);
        final basket = invocation.positionalArguments.first as Basket;
        return sampleOrder(
          id: basket.seller.id == 'se-1'
              ? '00000000-0000-4000-8000-000000000001'
              : '00000000-0000-4000-8000-000000000002',
          sellerId: basket.seller.id,
        );
      });

      await container
          .read(placeCartProvider.notifier)
          .place(await cart(), _contact);
      final state = container.read(placeCartProvider);

      expect(state.placed, hasLength(2));
      expect(state.problem, isNull);
      expect(keys.map((key) => key.split(':').last), ['se-1', 'se-2']);
      expect(keys.map((key) => key.split(':').first).toSet(), hasLength(1));
      expect(checkouts, hasLength(1));
      verify(() => kept.keep(any(), any())).called(2);
      expect(await container.read(keptCartProvider.future), isNull);
    });

    test(
      'stops at a refusal in the server words, keeping what was placed',
      () async {
        when(
          () => orders.place(
            any(),
            any(),
            idempotencyKey: any(named: 'idempotencyKey'),
            checkoutId: any(named: 'checkoutId'),
          ),
        ).thenAnswer((invocation) async {
          final basket = invocation.positionalArguments.first as Basket;
          if (basket.seller.id == 'se-2') {
            throw _refused(
              'ORDER_PHONE_HOLDS_ORDERS',
              detail: 'Số này đang giữ 2 đơn ở quán.',
            );
          }
          return sampleOrder(sellerId: 'se-1');
        });

        await container
            .read(placeCartProvider.notifier)
            .place(await cart(), _contact);
        final state = container.read(placeCartProvider);

        expect(state.placed, hasLength(1));
        expect(state.problem, isA<PlaceFailed>());
        final failed = state.problem! as PlaceFailed;
        expect(failed.detail, 'Số này đang giữ 2 đơn ở quán.');
        expect(failed.reference, 'req-1');
        expect((await cart()).baskets.map((basket) => basket.seller.id), [
          'se-2',
        ]);
      },
    );

    test('names the dishes someone else ordered first', () async {
      when(
        () => orders.place(
          any(),
          any(),
          idempotencyKey: any(named: 'idempotencyKey'),
          checkoutId: any(named: 'checkoutId'),
        ),
      ).thenThrow(_refused('ORDER_OFFER_SOLD_OUT'));
      when(() => orders.portionsLeft(any())).thenAnswer((_) async => 0);

      await container
          .read(placeCartProvider.notifier)
          .place(await cart(), _contact);
      final problem = container.read(placeCartProvider).problem;

      expect(problem, isA<PlaceGone>());
      final gone = problem! as PlaceGone;
      expect(gone.sellerId, 'se-1');
      expect(gone.cut.single.line.id, bread.id);
      expect(gone.rest, isNull);
    });

    test("gives the server's words when no dish is short", () async {
      when(
        () => orders.place(
          any(),
          any(),
          idempotencyKey: any(named: 'idempotencyKey'),
          checkoutId: any(named: 'checkoutId'),
        ),
      ).thenThrow(_refused('ORDER_OFFER_UNAVAILABLE', detail: 'Quán đã đóng.'));
      when(() => orders.portionsLeft(any())).thenAnswer((_) async => 3);

      await container
          .read(placeCartProvider.notifier)
          .place(await cart(), _contact);

      expect(
        (container.read(placeCartProvider).problem! as PlaceFailed).detail,
        'Quán đã đóng.',
      );
    });
  });
}
