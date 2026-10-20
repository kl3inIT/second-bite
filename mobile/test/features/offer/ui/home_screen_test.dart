import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

import '../../../helpers/helpers.dart';

class _MockOfferRepository extends Mock implements OfferRepository;

void main() {
  group(HomeScreen, () {
    late OfferRepository repository;

    setUpAll(() => registerFallbackValue(everyOffer));

    setUp(() => repository = _MockOfferRepository());

    Future<void> pumpHome(
      WidgetTester tester, {
      HomeQuery query = everyOffer,
      Locale locale = const Locale('vi'),
      AccountBody? account,
    }) async {
      // A tall phone, so the whole list is laid out.
      tester.view.physicalSize = const Size(1170, 6000);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpApp(
        HomeScreen(query: query),
        locale: locale,
        overrides: [offerRepositoryProvider.overrideWithValue(repository)],
        auth: signedInAs(account),
      );
    }

    group('renders', () {
      testWidgets('the sign-in capsule for someone signed out', (tester) async {
        when(() => repository.search(any())).thenAnswer((_) async => []);
        await pumpHome(tester);
        await tester.pump();

        expect(find.text('Đăng nhập'), findsOneWidget);
        expect(find.byTooltip('Tài khoản lan@gmail.com'), findsNothing);
      });

      testWidgets('the account capsule, whose menu signs out', (tester) async {
        when(() => repository.search(any())).thenAnswer((_) async => []);
        await pumpHome(tester, account: sampleAccount);
        await tester.pump();

        expect(find.text('Đăng nhập'), findsNothing);
        // Without a display name, the start of the address.
        expect(find.text('lan'), findsOneWidget);
        await tester.tap(find.byTooltip('Tài khoản lan@gmail.com'));
        await tester.pumpAndSettle();

        expect(find.text('Đã đăng nhập: lan@gmail.com'), findsOneWidget);
        expect(find.text('Đăng xuất'), findsOneWidget);
      });

      testWidgets('the header with the place and the search field', (
        tester,
      ) async {
        when(() => repository.search(any())).thenAnswer((_) async => []);
        await pumpHome(tester);
        await tester.pump();

        expect(find.text('Tasco Mall'), findsOneWidget);
        expect(find.byType(TextField), findsOneWidget);
      });

      testWidgets('a loading state until the offers arrive', (tester) async {
        final semantics = tester.ensureSemantics();
        when(() => repository.search(any())).thenAnswer(
          (_) => Future.delayed(const Duration(seconds: 1), () => []),
        );
        await pumpHome(tester);

        expect(find.bySemanticsLabel('Đang tải món…'), findsOneWidget);
        await tester.pump(const Duration(seconds: 1));
        semantics.dispose();
      });

      testWidgets("tonight's deals, the closing row and the grid", (
        tester,
      ) async {
        when(() => repository.search(any())).thenAnswer(
          (_) async => [
            sampleOffer(),
            sampleOffer(
              id: 'of-com',
              name: 'Cơm sườn nướng, 1 suất',
              sellerId: 'se-rice',
              sellerName: 'Quầy cơm',
              unitsLeft: 0,
              discountPercent: 40,
            ),
          ],
        );
        await pumpHome(tester);
        await tester.pump();

        expect(find.text('Túi ngon tối nay ở Tasco Mall'), findsOneWidget);
        expect(find.text('58%'), findsOneWidget);
        expect(find.text('3 túi đang mở · túi cuối lúc 21:45'), findsOneWidget);
        expect(find.text('Sắp hết giờ nhận'), findsOneWidget);
        expect(find.byType(AppOfferCard), findsOneWidget);
        expect(find.text('Quanh bạn ở Tasco Mall'), findsOneWidget);
        expect(find.byType(AppOfferTile), findsNWidgets(2));
        expect(find.text('Đã hết'), findsOneWidget);
      });

      testWidgets('the results of a filter without the deals', (tester) async {
        when(() => repository.search(any()))
            .thenAnswer((_) async => [sampleOffer()]);
        await pumpHome(tester, query: (q: 'bánh', kind: null, now: false));
        await tester.pump();

        expect(find.text('Kết quả'), findsOneWidget);
        expect(find.text('Túi ngon tối nay ở Tasco Mall'), findsNothing);
        expect(find.text('Sắp hết giờ nhận'), findsNothing);
      });

      testWidgets('an empty evening', (tester) async {
        when(() => repository.search(any())).thenAnswer((_) async => []);
        await pumpHome(tester);
        await tester.pump();

        expect(find.text('Tối nay chưa có món nào.'), findsOneWidget);
      });

      testWidgets('the strings in English', (tester) async {
        when(() => repository.search(any()))
            .thenAnswer((_) async => [sampleOffer()]);
        await pumpHome(tester, locale: const Locale('en'));
        await tester.pump();

        expect(find.text('Closing soon'), findsOneWidget);
        expect(find.text('3 left'), findsNWidgets(2));
      });
    });

    group('on failure', () {
      testWidgets("shows the server's reference and retries", (tester) async {
        var calls = 0;
        when(() => repository.search(any())).thenAnswer((_) async {
          calls++;
          if (calls == 1) {
            throw DioException(
              requestOptions: RequestOptions(path: '/offers'),
              response: Response(
                requestOptions: RequestOptions(path: '/offers'),
                statusCode: 500,
                data: <String, Object?>{
                  'type': 'urn:secondbite:failure:platform-internal-failure',
                  'title': 'Internal Server Error',
                  'status': 500,
                  'code': 'PLATFORM_INTERNAL_FAILURE',
                  'requestId': 'STUB',
                },
              ),
            );
          }
          return [sampleOffer()];
        });
        await pumpHome(tester);
        await tester.pump();

        expect(find.text('Đã có lỗi xảy ra'), findsOneWidget);
        expect(find.text('Mã tham chiếu: STUB'), findsOneWidget);

        await tester.tap(find.text('Thử lại'));
        await tester.pump();
        await tester.pump();

        expect(find.text('Đã có lỗi xảy ra'), findsNothing);
        expect(find.byType(AppOfferTile), findsOneWidget);
      });

      testWidgets('asks to check the connection without a server answer', (
        tester,
      ) async {
        when(() => repository.search(any())).thenThrow(
          DioException.connectionError(
            requestOptions: RequestOptions(path: '/offers'),
            reason: 'unreachable',
          ),
        );
        await pumpHome(tester);
        await tester.pump();

        expect(
          find.text('Không kết nối được. Vui lòng kiểm tra mạng rồi thử lại.'),
          findsOneWidget,
        );
      });
    });
  });
}
