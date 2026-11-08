import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/ui/seller_screen.dart';
import 'package:second_bite/features/order/data/kept_cart.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

class _MockOfferRepository extends Mock implements OfferRepository;

void main() {
  group(SellerScreen, () {
    late OfferRepository repository;
    // Before every window in the samples, so each dish can be ordered.
    final evening = DateTime.parse('2026-10-19T20:00:00+07:00');

    final bread = sampleOffer(sellerId: 'se-1');
    final cake = sampleOffer(
      id: 'of-cake',
      name: 'Bánh kem dâu',
      sellerId: 'se-1',
      unitsLeft: 1,
    ).copyWith(kind: FoundBodyKind.dessert);

    setUp(() {
      repository = _MockOfferRepository();
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
    });

    Future<void> pumpSeller(
      WidgetTester tester, {
      String? q,
      FoundBodyKind? kind,
    }) async {
      tester.view.physicalSize = const Size(1170, 4000);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpApp(
        SellerScreen(sellerId: 'se-1', q: q, kind: kind),
        overrides: [
          offerRepositoryProvider.overrideWithValue(repository),
          cartNowProvider.overrideWithValue(AsyncData(evening)),
        ],
      );
      await tester.pump();
      await tester.pump();
    }

    group('renders', () {
      testWidgets('the store, its window and its dishes', (tester) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread, cake]);
        await pumpSeller(tester);

        expect(find.text('Tiệm bánh Pháp'), findsOneWidget);
        expect(find.text('Nhận hôm nay 21:00–21:45'), findsOneWidget);
        expect(find.text('Chỉ đường ›'), findsOneWidget);
        expect(find.text(bread.name), findsOneWidget);
        expect(find.text('Bánh kem dâu'), findsOneWidget);
        expect(find.text('còn 3 phần'), findsOneWidget);
      });

      testWidgets('tabs by kind when it sells more than one', (tester) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread, cake]);
        await pumpSeller(tester, kind: FoundBodyKind.dessert);

        expect(find.text('Đang giảm'), findsOneWidget);
        expect(find.text('Bánh'), findsOneWidget);
        expect(find.text('Bánh kem dâu'), findsOneWidget);
        expect(find.text(bread.name), findsNothing);
      });

      testWidgets('only the dishes matching words, without accents', (
        tester,
      ) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread, cake]);
        await pumpSeller(tester, q: 'kem dau');

        expect(find.text('Bánh kem dâu'), findsOneWidget);
        expect(find.text(bread.name), findsNothing);
      });

      testWidgets('that no dish matches', (tester) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread]);
        await pumpSeller(tester, q: 'phở');

        expect(find.text('Không có món nào khớp “phở”'), findsOneWidget);
      });

      testWidgets('a store with nothing on sale tonight', (tester) async {
        when(() => repository.ofSeller('se-1')).thenAnswer(
          (_) async => [sampleOffer(sellerId: 'se-1', unitsLeft: 0)],
        );
        await pumpSeller(tester);

        expect(find.text('Quán chưa có món tối nay'), findsOneWidget);
        expect(find.text('Xem món khác'), findsOneWidget);
      });

      testWidgets("the server's words when it failed", (tester) async {
        when(() => repository.ofSeller('se-1')).thenThrow(
          DioException(
            requestOptions: RequestOptions(),
            response: Response(
              requestOptions: RequestOptions(),
              statusCode: 500,
              data: <String, Object?>{
                'code': 'PLATFORM_INTERNAL',
                'detail': 'Máy chủ đang bận.',
                'requestId': 'req-1',
                'status': 500,
                'title': 'Internal Server Error',
                'type': 'urn:secondbite:failure:platform-internal',
              },
            ),
          ),
        );
        await pumpSeller(tester);

        expect(find.text('Máy chủ đang bận.'), findsOneWidget);
        expect(find.text('Thử lại'), findsOneWidget);
      });
    });

    group('the cart', () {
      testWidgets('takes a dish from its +, and shows the bar', (tester) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread]);
        await pumpSeller(tester);

        expect(find.text('1 phần · tiết kiệm 56.000đ'), findsNothing);
        await tester.tap(find.byIcon(LucideIcons.plus));
        await tester.pumpAndSettle();

        expect(find.text('1'), findsOneWidget);
        expect(find.text('1 phần · tiết kiệm 56.000đ'), findsOneWidget);
      });

      testWidgets('stops at the portions left', (tester) async {
        when(() => repository.ofSeller('se-1')).thenAnswer((_) async => [cake]);
        await pumpSeller(tester);

        await tester.tap(find.byIcon(LucideIcons.plus));
        await tester.pumpAndSettle();

        expect(find.text('đã chọn đủ 1 phần'), findsOneWidget);
      });

      testWidgets("adds several from the dish's sheet", (tester) async {
        when(() => repository.ofSeller('se-1'))
            .thenAnswer((_) async => [bread]);
        await pumpSeller(tester);

        await tester.tap(find.text(bread.name));
        await tester.pumpAndSettle();
        expect(find.text('Lưu ý'), findsOneWidget);
        await tester.tap(find.byIcon(LucideIcons.plus).last);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Thêm vào giỏ · 78.000đ'));
        await tester.pumpAndSettle();

        expect(find.text('Lưu ý'), findsNothing);
        expect(find.text('2 phần · tiết kiệm 112.000đ'), findsOneWidget);
      });
    });
  });
}
