import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/data/kept_place.dart';
import 'package:second_bite/features/offer/data/locate.dart';
import 'package:second_bite/features/offer/ui/area_sheet.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_platform_interface/in_memory_shared_preferences_async.dart';
import 'package:shared_preferences_platform_interface/shared_preferences_async_platform_interface.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(AreaSheet, () {
    late PlacesClient places;
    late Locate locate;

    setUp(() {
      SharedPreferencesAsyncPlatform.instance =
          InMemorySharedPreferencesAsync.empty();
      places = MockPlacesClient();
      locate = () async => (latitude: 21.04012, longitude: 105.88049);
    });

    // A page that opens the sheet, as the home's header does.
    Future<void> openSheet(WidgetTester tester) async {
      tester.view.physicalSize = const Size(1170, 2532);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpApp(
        Consumer(
          builder: (context, ref, _) => Scaffold(
            body: Column(
              children: [
                Text('kept ${ref.watch(keptPlaceProvider).value?.name}'),
                TextButton(
                  onPressed: () => showAreaSheet(context),
                  child: const Text('open'),
                ),
              ],
            ),
          ),
        ),
        api: testApi(places: places),
        overrides: [locateProvider.overrideWithValue(() => locate())],
      );
      await tester.pump();
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
    }

    group('renders', () {
      testWidgets('every shop, the mall and near me', (tester) async {
        await openSheet(tester);

        expect(find.text('Xem món ở đâu?'), findsOneWidget);
        expect(find.text('Gần tôi'), findsOneWidget);
        expect(find.text('Tất cả quán'), findsOneWidget);
        expect(find.text('Tasco Mall Long Biên'), findsOneWidget);
      });

      testWidgets('that location is refused, without closing', (tester) async {
        locate = () async => throw const LocateFailure(denied: true);
        await openSheet(tester);

        await tester.tap(find.text('Gần tôi'));
        await tester.pumpAndSettle();

        expect(find.textContaining('chưa được phép định vị'), findsOneWidget);
        expect(find.text('Xem món ở đâu?'), findsOneWidget);
      });

      testWidgets('that no place matches the words', (tester) async {
        when(() => places.searchCustomerPlaces(q: 'zzzz'))
            .thenAnswer((_) async => const PlacesOutputBody(places: []));
        await openSheet(tester);

        await tester.enterText(find.byType(TextField), 'zzzz');
        await tester.pump(const Duration(milliseconds: 300));
        await tester.pump();

        expect(find.textContaining('Không tìm thấy nơi này'), findsOneWidget);
      });
    });

    group('updates', () {
      testWidgets('the place to one typed and chosen', (tester) async {
        when(() => places.searchCustomerPlaces(q: 'hoa lâm')).thenAnswer(
          (_) async => const PlacesOutputBody(
            places: [
              PlaceBody(
                address: 'Phố Hoa Lâm, Phường Việt Hưng, Hà Nội',
                latitude: 21.0501,
                longitude: 105.9012,
              ),
            ],
          ),
        );
        await openSheet(tester);

        await tester.enterText(find.byType(TextField), 'hoa lâm');
        // Nothing is asked while typing goes on.
        await tester.pump(const Duration(milliseconds: 200));
        verifyNever(() => places.searchCustomerPlaces(q: any(named: 'q')));
        await tester.pump(const Duration(milliseconds: 100));
        await tester.pump();
        await tester.tap(find.text('Phố Hoa Lâm'));
        await tester.pumpAndSettle();

        expect(find.text('kept Phố Hoa Lâm'), findsOneWidget);
        expect(
          await SharedPreferencesAsync().getString(placeKey),
          '{"near":"21.050,105.901","place":"Phố Hoa Lâm"}',
        );
      });

      testWidgets('the place to the phone, named by its street', (
        tester,
      ) async {
        when(() => places.customerAddressAt(latitude: 21.04, longitude: 105.88))
            .thenAnswer(
              (_) async =>
                  const AddressOutputBody(address: 'Ngõ 12, Long Biên'),
            );
        await openSheet(tester);

        await tester.tap(find.text('Gần tôi'));
        await tester.pumpAndSettle();

        expect(find.text('kept Ngõ 12'), findsOneWidget);
        expect(
          await SharedPreferencesAsync().getString(placeKey),
          '{"near":"21.040,105.880","place":"Ngõ 12"}',
        );
      });

      testWidgets('the place to every shop', (tester) async {
        await SharedPreferencesAsync().setString(
          placeKey,
          '{"near":"21.040,105.880","place":"Ngõ 12"}',
        );
        await openSheet(tester);

        await tester.tap(find.text('Tất cả quán'));
        await tester.pump();
        await tester.tap(find.text('Xem món'));
        await tester.pumpAndSettle();

        expect(find.text('kept null'), findsOneWidget);
        expect(await SharedPreferencesAsync().getString(placeKey), isNull);
      });
    });
  });
}
