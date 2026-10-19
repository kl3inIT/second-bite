import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppHomeHeader, () {
    group('renders', () {
      testWidgets('its title, action and children', (tester) async {
        await tester.pumpApp(
          const AppHomeHeader(
            title: Text('Tasco Mall'),
            action: Icon(Icons.translate),
            children: [Text('Tìm món')],
          ),
        );

        expect(find.text('Tasco Mall'), findsOneWidget);
        expect(find.byIcon(Icons.translate), findsOneWidget);
        expect(find.text('Tìm món'), findsOneWidget);
      });
    });
  });
}
