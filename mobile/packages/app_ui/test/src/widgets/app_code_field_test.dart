import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppCodeField, () {
    late TextEditingController controller;

    setUp(() => controller = TextEditingController());
    tearDown(() => controller.dispose());

    testWidgets('draws one slot per digit, filled as typed', (tester) async {
      await tester.pumpApp(
        AppCodeField(controller: controller, semanticLabel: 'Mã'),
      );

      await tester.enterText(find.byType(TextField), '12');
      await tester.pump();

      expect(find.text('1'), findsOneWidget);
      expect(find.text('2'), findsOneWidget);
    });

    testWidgets('keeps only the digits of a paste, at most six', (
      tester,
    ) async {
      String? completed;
      await tester.pumpApp(
        AppCodeField(
          controller: controller,
          semanticLabel: 'Mã',
          onCompleted: (code) => completed = code,
        ),
      );

      await tester.enterText(find.byType(TextField), ' 123 456\n78');
      await tester.pump();

      expect(controller.text, '123456');
      expect(completed, '123456');
    });

    testWidgets('does not complete before the last digit', (tester) async {
      String? completed;
      await tester.pumpApp(
        AppCodeField(
          controller: controller,
          semanticLabel: 'Mã',
          onCompleted: (code) => completed = code,
        ),
      );

      await tester.enterText(find.byType(TextField), '12345');
      await tester.pump();

      expect(completed, isNull);
    });

    testWidgets('asks the keyboard for the one-time code', (tester) async {
      await tester.pumpApp(
        AppCodeField(controller: controller, semanticLabel: 'Mã'),
      );

      final field = tester.widget<TextField>(find.byType(TextField));
      expect(field.autofillHints, [AutofillHints.oneTimeCode]);
      expect(field.keyboardType, TextInputType.number);
    });

    testWidgets('is named for a screen reader', (tester) async {
      final semantics = tester.ensureSemantics();
      await tester.pumpApp(
        AppCodeField(controller: controller, semanticLabel: 'Mã 6 số'),
      );

      expect(find.bySemanticsLabel('Mã 6 số'), findsOneWidget);
      semantics.dispose();
    });
  });
}
