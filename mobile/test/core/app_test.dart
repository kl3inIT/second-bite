import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/app.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';
import 'package:second_bite/features/order/data/kept_orders.dart';
import 'package:second_bite/features/order/ui/order_parts.dart';
import 'package:second_bite/features/order/ui/orders_screen.dart';
import 'package:second_bite/features/seller/ui/favourites_screen.dart';

import '../helpers/helpers.dart';

class _MockOfferRepository extends Mock implements OfferRepository;

class _MockKeptOrders extends Mock implements KeptOrders;

void main() {
  group(App, () {
    late OfferRepository repository;

    setUpAll(() => registerFallbackValue(everyOffer));

    setUp(() {
      repository = _MockOfferRepository();
      when(() => repository.search(any())).thenAnswer((_) async => []);
    });

    group('renders', () {
      testWidgets('$HomeScreen at the root route', (tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              offerRepositoryProvider.overrideWithValue(repository),
              authRepositoryProvider.overrideWithValue(signedInAs(null)),
              apiProvider.overrideWithValue(testApi()),
            ],
            child: const App(),
          ),
        );
        await tester.pump();

        expect(find.byType(HomeScreen), findsOneWidget);
      });
    });

    group('switches language', () {
      testWidgets('from the header', (tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              offerRepositoryProvider.overrideWithValue(repository),
              authRepositoryProvider.overrideWithValue(signedInAs(null)),
              apiProvider.overrideWithValue(testApi()),
            ],
            child: const App(),
          ),
        );
        await tester.pump();
        final before = find.text('Tất cả quán').evaluate().isNotEmpty;

        await tester.tap(
          find.byTooltip(
            before ? 'Switch to English' : 'Chuyển sang tiếng Việt',
          ),
        );
        await tester.pump();

        expect(find.text(before ? 'All shops' : 'Tất cả quán'), findsOneWidget);
      });
    });

    group('navigates', () {
      testWidgets('to $FavouritesScreen and $AccountScreen from the bottom '
          'bar', (tester) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              offerRepositoryProvider.overrideWithValue(repository),
              authRepositoryProvider.overrideWithValue(signedInAs(null)),
              apiProvider.overrideWithValue(testApi()),
            ],
            child: const App(),
          ),
        );
        await tester.pump();
        final destinations = find.byType(NavigationDestination);

        await tester.tap(destinations.at(2));
        await tester.pumpAndSettle();
        expect(find.byType(FavouritesScreen), findsOneWidget);
        expect(find.byType(AccountScreen), findsNothing);

        await tester.tap(destinations.at(3));
        await tester.pumpAndSettle();
        expect(find.byType(AccountScreen), findsOneWidget);
      });

      testWidgets('to $OrdersScreen from the bottom bar', (tester) async {
        final kept = _MockKeptOrders();
        when(kept.read).thenAnswer((_) async => const []);
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              offerRepositoryProvider.overrideWithValue(repository),
              authRepositoryProvider.overrideWithValue(signedInAs(null)),
              keptOrdersProvider.overrideWithValue(kept),
            ],
            child: const App(),
          ),
        );
        await tester.pump();

        await tester.tap(find.byType(NavigationDestination).at(1));
        await tester.pumpAndSettle();

        expect(find.byType(OrdersScreen), findsOneWidget);
        // Signed out, and nothing ordered on this phone: the way to sign in.
        expect(find.byType(OrdersSignInPrompt), findsOneWidget);
      });

      testWidgets('to $SignInScreen from the header, and back home', (
        tester,
      ) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [
              offerRepositoryProvider.overrideWithValue(repository),
              authRepositoryProvider.overrideWithValue(signedInAs(null)),
              apiProvider.overrideWithValue(testApi()),
            ],
            child: const App(),
          ),
        );
        await tester.pump();

        // The device's language: Vietnamese or English.
        await tester.tap(find.textContaining(RegExp(r'^(Đăng nhập|Sign in)$')));
        await tester.pumpAndSettle();
        expect(find.byType(SignInScreen), findsOneWidget);

        await tester.tap(find.byIcon(LucideIcons.chevronLeft));
        await tester.pumpAndSettle();
        expect(find.byType(HomeScreen), findsOneWidget);
      });
    });
  });
}
