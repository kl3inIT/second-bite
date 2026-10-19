import 'package:app_ui/app_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/app.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/offer/data/offer_repository.dart';
import 'package:second_bite/features/offer/domain/offer_summary.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

class _MockOfferRepository extends Mock implements OfferRepository;

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
            overrides: [offerRepositoryProvider.overrideWithValue(repository)],
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
            overrides: [offerRepositoryProvider.overrideWithValue(repository)],
            child: const App(),
          ),
        );
        await tester.pump();
        final before = find.text('Long Biên, Hà Nội').evaluate().isNotEmpty;

        await tester.tap(
          find.byTooltip(
            before ? 'Switch to English' : 'Chuyển sang tiếng Việt',
          ),
        );
        await tester.pump();

        expect(
          find.text(before ? 'Long Biên, Hanoi' : 'Long Biên, Hà Nội'),
          findsOneWidget,
        );
      });
    });

    group('navigates', () {
      testWidgets('to $AccountScreen from the bottom bar, and only there', (
        tester,
      ) async {
        await tester.pumpWidget(
          ProviderScope(
            overrides: [offerRepositoryProvider.overrideWithValue(repository)],
            child: const App(),
          ),
        );
        await tester.pump();
        final destinations = find.byType(NavigationDestination);

        // Orders and saved sellers have no screen yet.
        await tester.tap(destinations.at(1), warnIfMissed: false);
        await tester.pumpAndSettle();
        expect(find.byType(HomeScreen), findsOneWidget);
        expect(find.byType(AccountScreen), findsNothing);

        await tester.tap(destinations.at(3));
        await tester.pumpAndSettle();
        expect(find.byType(AccountScreen), findsOneWidget);
      });
    });
  });
}
