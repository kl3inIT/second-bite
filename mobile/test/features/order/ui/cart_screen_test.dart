import 'dart:convert';

import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/data/order_repository.dart';
import 'package:second_bite/features/order/domain/cart.dart';
import 'package:second_bite/features/order/ui/cart_screen.dart';
import 'package:second_bite/features/order/ui/gone_sheet.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

class _MockOrderRepository extends Mock implements OrderRepository;

class _MockKeptOrders extends Mock implements KeptOrders;

void main() {
  group(CartScreen, () {
    late OrderRepository orders;
    late KeptOrders kept;
    // Before every window in the samples, so each dish can be ordered.
    final evening = DateTime.parse('2026-10-19T20:00:00+07:00');
    final bread = sampleOffer(sellerId: 'se-1');
    final cake = sampleOffer(
      id: 'of-cake',
      name: 'Bánh kem dâu',
      sellerId: 'se-2',
      sellerName: 'Quán kem',
    );

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
      registerFallbackValue((name: '', phone: ''));
    });

    setUp(() {
      orders = _MockOrderRepository();
      kept = _MockKeptOrders();
      when(() => orders.runningPromotions(any())).thenAnswer((_) async => []);
      when(() => kept.keep(any(), any())).thenAnswer((_) async {});
    });

    void keepCart(Cart? cart) {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.withData({
            if (cart != null) cartKey: jsonEncode(cart),
          });
    }

    Future<void> pumpCart(WidgetTester tester) async {
      tester.view.physicalSize = const Size(1170, 4000);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      // Placed, the cart opens the first order's page.
      final router = GoRouter(
        initialLocation: '/cart',
        routes: [
          GoRoute(path: '/cart', builder: (_, _) => const CartScreen()),
          GoRoute(
            path: '/orders/:orderId',
            builder: (_, state) =>
                Text('order ${state.pathParameters['orderId']}'),
          ),
          GoRoute(path: '/', builder: (_, _) => const Text('home')),
        ],
      );
      await tester.pumpRouterApp(
        router,
        overrides: [
          orderRepositoryProvider.overrideWithValue(orders),
          keptOrdersProvider.overrideWithValue(kept),
          cartNowProvider.overrideWithValue(AsyncData(evening)),
        ],
      );
      await tester.pump();
      await tester.pump();
    }

    void placing(Future<OrderBody> Function(Basket basket) answer) {
      when(
        () => orders.place(
          any(),
          any(),
          idempotencyKey: any(named: 'idempotencyKey'),
          checkoutId: any(named: 'checkoutId'),
        ),
      ).thenAnswer(
        (invocation) => answer(invocation.positionalArguments.first as Basket),
      );
    }

    Future<void> confirmContact(WidgetTester tester) async {
      await tester.enterText(find.byType(TextField).at(0), 'Minh Anh');
      await tester.enterText(find.byType(TextField).at(1), '0900 000 000');
      await tester.tap(find.text('Tiếp tục'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Đúng, đặt món'));
      await tester.pumpAndSettle();
    }

    group('renders', () {
      testWidgets('an empty cart and the way to tonight', (tester) async {
        keepCart(null);
        await pumpCart(tester);

        expect(find.text('Giỏ hàng đang trống'), findsOneWidget);
        expect(find.text('Xem món tối nay'), findsOneWidget);
      });

      testWidgets('a card per store, payment, totals and the order', (
        tester,
      ) async {
        keepCart(addOne(addOne(null, bread), cake));
        await pumpCart(tester);

        expect(find.text('Tiệm bánh Pháp'), findsOneWidget);
        expect(find.text('Quán kem'), findsOneWidget);
        expect(find.text('Tầng 1 · Nhận 21:00 – 21:45'), findsNWidgets(2));
        expect(find.text('Thanh toán tại quầy'), findsOneWidget);
        expect(find.text('Tổng cộng · 2 đơn'), findsOneWidget);
        expect(find.text('Tiền món (2 phần)'), findsOneWidget);
        expect(find.text('Chính sách huỷ'.toUpperCase()), findsOneWidget);
        expect(find.text('Đặt 2 đơn'), findsOneWidget);
      });

      testWidgets('the promotions running for its stores', (tester) async {
        when(() => orders.runningPromotions(any())).thenAnswer(
          (_) async => [
            RunningPromotionBody(
              allSellers: true,
              endsAt: DateTime.parse('2026-11-16T00:00:00+07:00'),
              id: 'pr-1',
              name: 'Hỗ trợ quán mới',
              perPhonePerDay: 1,
              sellerIds: const [],
              rules: const [
                PromotionRuleBody(
                  name: 'Đơn đầu',
                  reward: PromotionRewardBody(
                    type: PromotionRewardBodyType.fixed,
                    value: 10000,
                  ),
                  conditions: [
                    PromotionConditionBody(
                      attribute: PromotionConditionBodyAttribute.subtotal,
                      operatorEnum: PromotionConditionBodyOperatorEnum.gte,
                      values: ['30000'],
                    ),
                  ],
                ),
              ],
            ),
          ],
        );
        keepCart(addOne(null, bread));
        await pumpCart(tester);

        expect(find.text('Hỗ trợ quán mới'), findsOneWidget);
        expect(
          find.text('Đơn đầu: giảm 10.000đ cho đơn từ 30.000đ'),
          findsOneWidget,
        );
        expect(
          find.text('Mỗi số điện thoại được giảm 1 lần mỗi ngày.'),
          findsOneWidget,
        );
      });
    });

    group('placing', () {
      testWidgets('asks who collects and checks the fields', (tester) async {
        keepCart(addOne(null, bread));
        await pumpCart(tester);
        await tester.tap(find.text('Đặt món'));
        await tester.pumpAndSettle();

        expect(find.text('Người đến nhận'), findsOneWidget);
        await tester.tap(find.text('Tiếp tục'));
        await tester.pumpAndSettle();

        expect(find.text('Nhập tên từ 1 đến 50 ký tự.'), findsOneWidget);
        expect(
          find.text('Nhập số điện thoại 10 số, bắt đầu bằng 0.'),
          findsOneWidget,
        );
      });

      testWidgets("places the order and opens the order's page", (
        tester,
      ) async {
        placing((basket) async => sampleOrder(sellerId: basket.seller.id));
        keepCart(addOne(null, bread));
        await pumpCart(tester);
        await tester.tap(find.text('Đặt món'));
        await tester.pumpAndSettle();
        await confirmContact(tester);

        expect(
          find.text('order 00000000-0000-4000-8000-000000000001'),
          findsOneWidget,
        );
        verify(
          () => kept.keep(
            '00000000-0000-4000-8000-000000000001',
            'abcdefghijklmnopqrstuv',
          ),
        ).called(1);
      });

      testWidgets("shows a refusal in the server's words", (tester) async {
        placing(
          (_) async => throw DioException(
            requestOptions: RequestOptions(),
            response: Response(
              requestOptions: RequestOptions(),
              statusCode: 403,
              data: <String, Object?>{
                'code': 'ORDER_PHONE_MISSED_ORDERS',
                'detail': 'Số này đã không đến nhận 3 đơn. Thử lại sau.',
                'requestId': 'req-9',
                'status': 403,
                'title': 'Forbidden',
                'type': 'urn:secondbite:failure:order',
              },
            ),
          ),
        );
        keepCart(addOne(null, bread));
        await pumpCart(tester);
        await tester.tap(find.text('Đặt món'));
        await tester.pumpAndSettle();
        await confirmContact(tester);

        expect(
          find.text('Số này đã không đến nhận 3 đơn. Thử lại sau.'),
          findsOneWidget,
        );
        expect(find.text('Mã tham chiếu: req-9'), findsOneWidget);
      });

      testWidgets('offers the rest when a dish sold out', (tester) async {
        placing(
          (_) async => throw DioException(
            requestOptions: RequestOptions(),
            response: Response(
              requestOptions: RequestOptions(),
              statusCode: 409,
              data: <String, Object?>{
                'code': 'ORDER_OFFER_SOLD_OUT',
                'detail': 'Món đã hết.',
                'status': 409,
                'title': 'Conflict',
                'type': 'urn:secondbite:failure:order',
              },
            ),
          ),
        );
        when(() => orders.portionsLeft(bread.id)).thenAnswer((_) async => 1);
        keepCart(addPortions(null, bread, 3));
        await pumpCart(tester);
        await tester.tap(find.text('Đặt món'));
        await tester.pumpAndSettle();
        await confirmContact(tester);

        expect(
          find.text('Túi bánh mì và croissant, 4 chiếc chỉ còn 1 phần'),
          findsOneWidget,
        );
        expect(find.text('Xem món khác của quán'), findsOneWidget);
      });
    });
  });

  group(GoneSheet, () {
    final bread = sampleOffer(sellerId: 'se-1');

    testWidgets('names a dish that is gone and orders the rest', (
      tester,
    ) async {
      final basket = addOne(
        addOne(null, bread),
        sampleOffer(id: 'of-cake', name: 'Bánh kem dâu', sellerId: 'se-1'),
      ).baskets.first;
      final left = keepLeft(basket, {bread.id: 0, 'of-cake': 1});
      await tester.pumpApp(
        Scaffold(
          body: GoneSheet(cut: left.cut, rest: left.basket),
        ),
      );

      expect(
        find.text('Túi bánh mì và croissant, 4 chiếc vừa hết'),
        findsOneWidget,
      );
      expect(
        find.text('Người khác vừa đặt phần cuối. Bạn chưa bị tính tiền.'),
        findsOneWidget,
      );
      expect(find.text('Đặt 1× Bánh kem dâu · 39.000đ'), findsOneWidget);
    });
  });
}
