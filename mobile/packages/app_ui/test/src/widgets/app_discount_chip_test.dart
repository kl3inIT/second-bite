import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppDiscountChip, () {
    group('renders', () {
      testWidgets('the discount as written', (tester) async {
        await tester.pumpApp(
          const AppDiscountChip(label: '-58%', semanticLabel: 'Giảm 58%'),
        );

        expect(find.text('-58%'), findsOneWidget);
      });

      testWidgets('the discount in words for a screen reader', (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(
          const AppDiscountChip(label: '-58%', semanticLabel: 'Giảm 58%'),
        );

        expect(find.bySemanticsLabel('Giảm 58%'), findsOneWidget);
        expect(find.bySemanticsLabel('-58%'), findsNothing);
        semantics.dispose();
      });
    });
  });
}
