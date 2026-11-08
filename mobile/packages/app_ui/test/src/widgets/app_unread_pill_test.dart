import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppUnreadPill, () {
    group('renders', () {
      testWidgets('the count, read as its label', (tester) async {
        await tester.pumpApp(
          const AppUnreadPill(count: 2, label: '2 tin nhắn chưa đọc'),
        );

        expect(find.text('2'), findsOneWidget);
        expect(find.bySemanticsLabel('2 tin nhắn chưa đọc'), findsOneWidget);
      });

      testWidgets('nothing for none', (tester) async {
        await tester.pumpApp(
          const AppUnreadPill(count: 0, label: '0 tin nhắn chưa đọc'),
        );

        expect(find.text('0'), findsNothing);
      });
    });
  });
}
