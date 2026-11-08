import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/seller/data/follows.dart';
import 'package:second_bite/features/seller/ui/favourites_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

class _MockOfferRepository extends Mock implements OfferRepository;

void main() {
  group(FavouritesScreen, () {
    late OfferRepository repository;
    late SellersClient sellers;

    setUpAll(() => registerFallbackValue(everyOffer));

    setUp(() {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
      repository = _MockOfferRepository();
      sellers = MockSellersClient();
      when(sellers.listFollowedSellers).thenThrow(unauthorized());
      when(() => repository.search(any(), near: any(named: 'near')))
          .thenAnswer((_) async => [sampleOffer(sellerId: 'se-1')]);
    });

    Future<void> pumpFavourites(WidgetTester tester) async {
      await tester.pumpApp(
        const FavouritesScreen(),
        api: testApi(sellers: sellers),
        overrides: [offerRepositoryProvider.overrideWithValue(repository)],
      );
      await tester.pump();
      await tester.pump();
    }

    group('renders', () {
      testWidgets('the empty state while no store is followed', (tester) async {
        await pumpFavourites(tester);

        expect(find.text('Chưa có quán yêu thích'), findsOneWidget);
        expect(find.text('Khám phá quán'), findsOneWidget);
      });

      testWidgets('each followed store with its dishes tonight, and one '
          'without any read on its own', (tester) async {
        await SharedPreferencesAsync().setString(followsKey, '["se-1","se-2"]');
        when(() => sellers.getSellerProfile(sellerId: 'se-2')).thenAnswer(
          (_) async => sampleProfile(id: 'se-2', name: 'Gà rán Hoa Lâm'),
        );
        await pumpFavourites(tester);
        await tester.pump();

        expect(find.text('Quán bạn theo dõi'), findsOneWidget);
        // On the card and on its dish.
        expect(find.text('Tiệm bánh Pháp'), findsWidgets);
        expect(find.text('Túi bánh mì và croissant, 4 chiếc'), findsOneWidget);
        expect(find.text('Gà rán Hoa Lâm'), findsOneWidget);
        expect(find.text('Tối nay chưa có món giảm'), findsOneWidget);
      });

      testWidgets('nothing for a followed store that is gone', (tester) async {
        await SharedPreferencesAsync().setString(followsKey, '["se-gone"]');
        when(() => sellers.getSellerProfile(sellerId: 'se-gone')).thenAnswer(
          (_) async => throw DioException(
            requestOptions: RequestOptions(),
            response: Response(
              requestOptions: RequestOptions(),
              statusCode: 404,
            ),
          ),
        );
        await pumpFavourites(tester);
        await tester.pump();

        expect(find.text('Quán bạn theo dõi'), findsOneWidget);
        expect(find.text('Tối nay chưa có món giảm'), findsNothing);
      });
    });

    group('updates', () {
      testWidgets('lets a store go with its heart, and says so', (
        tester,
      ) async {
        await SharedPreferencesAsync().setString(followsKey, '["se-1"]');
        await pumpFavourites(tester);

        await tester.tap(find.byTooltip('Yêu thích Tiệm bánh Pháp'));
        await tester.pump();
        await tester.pump();

        expect(find.text('Đã bỏ khỏi Yêu thích'), findsOneWidget);
        expect(find.text('Chưa có quán yêu thích'), findsOneWidget);
        expect(await SharedPreferencesAsync().getString(followsKey), isNull);
      });
    });
  });
}
