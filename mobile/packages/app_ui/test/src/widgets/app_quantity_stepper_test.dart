import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppQuantityStepper, () {
    Widget stepper({
      int quantity = 2,
      VoidCallback? onAdd,
      VoidCallback? onRemove,
    }) => AppQuantityStepper(
      quantity: quantity,
      addLabel: 'Thêm một phần Bánh mì',
      removeLabel: 'Bớt một phần Bánh mì',
      quantityLabel: '$quantity phần Bánh mì trong giỏ',
      onAdd: onAdd,
      onRemove: onRemove,
    );

    group('renders', () {
      testWidgets('a lone + while none is chosen', (tester) async {
        await tester.pumpApp(stepper(quantity: 0, onAdd: () {}));

        expect(find.byIcon(LucideIcons.plus), findsOneWidget);
        expect(find.byIcon(LucideIcons.minus), findsNothing);
        expect(find.text('0'), findsNothing);
      });

      testWidgets('− count + once one is chosen', (tester) async {
        await tester.pumpApp(stepper(onAdd: () {}, onRemove: () {}));

        expect(find.byIcon(LucideIcons.minus), findsOneWidget);
        expect(find.text('2'), findsOneWidget);
        expect(find.byIcon(LucideIcons.plus), findsOneWidget);
      });

      testWidgets('its buttons and count in words', (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(stepper(onAdd: () {}, onRemove: () {}));

        expect(find.bySemanticsLabel('Thêm một phần Bánh mì'), findsOneWidget);
        expect(find.bySemanticsLabel('Bớt một phần Bánh mì'), findsOneWidget);
        expect(
          find.bySemanticsLabel('2 phần Bánh mì trong giỏ'),
          findsOneWidget,
        );
        semantics.dispose();
      });
    });

    group('calls', () {
      testWidgets('onAdd and onRemove when pressed', (tester) async {
        var added = 0;
        var removed = 0;
        await tester.pumpApp(
          stepper(onAdd: () => added++, onRemove: () => removed++),
        );

        await tester.tap(find.byIcon(LucideIcons.plus));
        await tester.tap(find.byIcon(LucideIcons.minus));

        expect(added, 1);
        expect(removed, 1);
      });

      testWidgets('nothing on a + that cannot add', (tester) async {
        var removed = 0;
        await tester.pumpApp(stepper(onRemove: () => removed++));

        await tester.tap(find.byIcon(LucideIcons.plus));

        expect(removed, 0);
      });
    });
  });
}
