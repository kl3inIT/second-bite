import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppChatBubble, () {
    group('renders', () {
      testWidgets("the other side's message with its caption", (tester) async {
        await tester.pumpApp(
          const AppChatBubble(
            text: 'Món đã sẵn sàng',
            own: false,
            caption: Text('21:05'),
          ),
        );

        expect(find.text('Món đã sẵn sàng'), findsOneWidget);
        expect(find.text('21:05'), findsOneWidget);
      });

      testWidgets("the reader's own message, read after who wrote it", (
        tester,
      ) async {
        await tester.pumpApp(
          const AppChatBubble(
            text: 'Mình đang tới',
            own: true,
            ownLabel: 'Bạn',
          ),
        );

        expect(find.bySemanticsLabel('Bạn: Mình đang tới'), findsOneWidget);
      });
    });
  });
}
