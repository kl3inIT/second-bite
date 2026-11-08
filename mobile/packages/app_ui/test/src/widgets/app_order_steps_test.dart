import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppOrderSteps, () {
    const steps = [
      AppOrderStep(
        icon: LucideIcons.receiptText,
        label: 'Đã đặt',
        state: AppOrderStepState.done,
      ),
      AppOrderStep(
        icon: LucideIcons.store,
        label: 'Chuẩn bị',
        state: AppOrderStepState.now,
      ),
      AppOrderStep(
        icon: LucideIcons.shoppingBag,
        label: 'Sẵn sàng',
        state: AppOrderStepState.later,
      ),
    ];

    group('renders', () {
      testWidgets('each step by its name', (tester) async {
        await tester.pumpApp(
          const AppOrderSteps(label: 'Các bước của đơn', steps: steps),
        );

        expect(find.text('Đã đặt'), findsOneWidget);
        expect(find.text('Chuẩn bị'), findsOneWidget);
        expect(find.text('Sẵn sàng'), findsOneWidget);
      });

      testWidgets('the current step as selected for a screen reader', (
        tester,
      ) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(
          const AppOrderSteps(label: 'Các bước của đơn', steps: steps),
        );

        expect(
          tester.getSemantics(find.text('Chuẩn bị')),
          isSemantics(isSelected: true),
        );
        expect(
          tester.getSemantics(find.text('Sẵn sàng')),
          isNot(isSemantics(isSelected: true)),
        );
        semantics.dispose();
      });
    });
  });
}
