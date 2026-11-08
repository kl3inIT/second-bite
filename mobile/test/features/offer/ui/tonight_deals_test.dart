import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/features/offer/ui/tonight_deals.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(TonightDeals, () {
    final offers = [
      sampleOffer(),
      sampleOffer(
        id: 'of-com',
        sellerId: 'se-rice',
        sellerName: 'Quầy cơm',
        discountPercent: 40,
      ),
    ];

    Future<void> pumpDeals(WidgetTester tester) => tester.pumpRouterApp(
      GoRouter(
        routes: [
          GoRoute(
            path: '/',
            builder: (_, _) => Scaffold(
              body: TonightDeals(offers: offers, onOpenList: () {}),
            ),
          ),
          GoRoute(
            path: '/sellers/:id',
            builder: (_, state) => Text(
              'store ${state.pathParameters['id']} at '
              '${state.uri.queryParameters['at']}',
            ),
          ),
        ],
      ),
    );

    testWidgets('shows each ticket as the web does: discount and store', (
      tester,
    ) async {
      await pumpDeals(tester);
      await tester.pumpAndSettle();

      expect(find.text('-58%'), findsOneWidget);
      expect(find.text('-40%'), findsOneWidget);
      expect(find.text('Tiệm bánh Pháp'), findsOneWidget);
      expect(find.text('Quầy cơm'), findsOneWidget);
    });

    testWidgets('opens the store at the dish from a ticket', (tester) async {
      await pumpDeals(tester);
      await tester.pumpAndSettle();

      await tester.tap(find.text('Quầy cơm'));
      await tester.pumpAndSettle();

      expect(find.text('store se-rice at of-com'), findsOneWidget);
    });
  });
}
