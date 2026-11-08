import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppStatusPill, () {
    group('renders', () {
      testWidgets('the status', (tester) async {
        await tester.pumpApp(
          const AppStatusPill(label: 'Sẵn sàng · đến 21:45'),
        );

        expect(find.text('Sẵn sàng · đến 21:45'), findsOneWidget);
      });
    });
  });
}
