import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/offer/ui/home_screen.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(HomeScreen, () {
    group('renders', () {
      testWidgets('the heading in Vietnamese', (tester) async {
        await tester.pumpApp(const HomeScreen());

        expect(find.text('Tối nay ở Tasco Mall'), findsOneWidget);
        expect(find.text('Second Bite'), findsOneWidget);
      });

      testWidgets('the heading in English', (tester) async {
        await tester.pumpApp(const HomeScreen(), locale: const Locale('en'));

        expect(find.text('Tonight at Tasco Mall'), findsOneWidget);
      });
    });
  });
}
