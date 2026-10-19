import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppSectionHeader, () {
    group('renders', () {
      testWidgets('its title as a heading', (tester) async {
        final semantics = tester.ensureSemantics();
        await tester.pumpApp(const AppSectionHeader(title: 'Sắp hết giờ lấy'));

        expect(
          tester.getSemantics(find.text('Sắp hết giờ lấy')),
          matchesSemantics(label: 'Sắp hết giờ lấy', isHeader: true),
        );
        semantics.dispose();
      });

      testWidgets('its action', (tester) async {
        var tapped = false;
        await tester.pumpApp(
          AppSectionHeader(
            title: 'Sắp hết giờ lấy',
            action: TextButton(
              onPressed: () => tapped = true,
              child: const Text('Xem tất cả'),
            ),
          ),
        );
        await tester.tap(find.text('Xem tất cả'));

        expect(tapped, isTrue);
      });
    });
  });
}
