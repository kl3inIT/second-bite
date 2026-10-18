import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/core/app.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

void main() {
  group(App, () {
    group('renders', () {
      testWidgets('$HomeScreen at the root route', (tester) async {
        await tester.pumpWidget(const ProviderScope(child: App()));
        await tester.pump();

        expect(find.byType(HomeScreen), findsOneWidget);
      });
    });
  });
}
