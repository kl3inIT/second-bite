import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppWordmark, () {
    group('renders', () {
      testWidgets("the product's name for a screen reader", (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(const AppWordmark(semanticLabel: 'Second Bite'));

        expect(find.bySemanticsLabel('Second Bite'), findsOneWidget);
        semantics.dispose();
      });

      testWidgets('at the height it is given', (tester) async {
        await tester.pumpApp(
          const Center(
            child: AppWordmark(semanticLabel: 'Second Bite', height: 32),
          ),
        );

        expect(tester.getSize(find.byType(AppWordmark)).height, 32);
      });
    });
  });
}
