import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/features/offer/domain/search_query.dart';
import 'package:second_bite/features/offer/ui/search_filters.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(SearchFilters, () {
    // The search at its address, with the chips and the address shown.
    Future<void> pumpFilters(
      WidgetTester tester, {
      bool near = false,
      String location = '/search',
    }) async {
      final router = GoRouter(
        initialLocation: location,
        routes: [
          GoRoute(
            path: '/search',
            builder: (_, state) {
              final params = state.uri.queryParameters;
              return Scaffold(
                body: Column(
                  children: [
                    SearchFilters(
                      query: readSearchQuery(
                        near: near,
                        q: params['q'],
                        kind: params['kind'],
                        now: params['now'],
                        radiusKm: params['radiusKm'],
                        minPrice: params['minPrice'],
                        maxPrice: params['maxPrice'],
                        from: params['from'],
                        to: params['to'],
                        sort: params['sort'],
                      ),
                      near: near,
                      sortable: true,
                    ),
                    Text('at ${state.uri}'),
                  ],
                ),
              );
            },
          ),
        ],
      );
      await tester.pumpRouterApp(router);
      await tester.pump();
    }

    group('renders', () {
      testWidgets('the distance only around a place', (tester) async {
        await pumpFilters(tester);
        expect(find.text('Khoảng cách'), findsNothing);
        expect(find.text('Giá'), findsOneWidget);
        expect(find.text('Giờ nhận'), findsOneWidget);
        expect(find.text('Loại món'), findsOneWidget);

        await pumpFilters(tester, near: true);
        expect(find.text('Khoảng cách'), findsOneWidget);
      });
    });

    group('navigates', () {
      testWidgets('to the kind chosen from its menu', (tester) async {
        await pumpFilters(tester, location: '/search?q=b%C3%A1nh');

        await tester.tap(find.text('Loại món'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('Bánh').last);
        await tester.pumpAndSettle();

        expect(find.text('at /search?q=b%C3%A1nh&kind=bakery'), findsOneWidget);
      });

      testWidgets('to a price range chosen from its quick choices', (
        tester,
      ) async {
        await pumpFilters(tester);

        await tester.tap(find.text('Giá'));
        await tester.pumpAndSettle();
        await tester.tap(find.byType(ChoiceChip).at(1));
        await tester.pumpAndSettle();

        expect(
          find.text('at /search?minPrice=20000&maxPrice=40000'),
          findsOneWidget,
        );
      });

      testWidgets('to collecting now from the time chip', (tester) async {
        await pumpFilters(tester);

        await tester.tap(find.text('Giờ nhận'));
        await tester.pumpAndSettle();
        await tester.tap(find.widgetWithText(ChoiceChip, 'Nhận ngay'));
        await tester.pumpAndSettle();

        expect(find.text('at /search?now=1'), findsOneWidget);
      });

      testWidgets('nowhere while a typed range is out of order', (
        tester,
      ) async {
        await pumpFilters(tester);

        await tester.tap(find.text('Giá'));
        await tester.pumpAndSettle();
        await tester.enterText(find.byType(TextField).first, '50000');
        await tester.enterText(find.byType(TextField).last, '30000');
        await tester.tap(find.text('Áp dụng'));
        await tester.pumpAndSettle();

        expect(find.text('Giá “từ” cần thấp hơn giá “đến”.'), findsNWidgets(2));
        expect(find.text('at /search'), findsOneWidget);
      });
    });
  });
}
