import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppBiteCorner, () {
    group('renders', () {
      testWidgets('at the size it is given', (tester) async {
        await tester.pumpApp(const Center(child: AppBiteCorner(size: 44)));

        expect(tester.getSize(find.byType(AppBiteCorner)), const Size(44, 44));
      });
    });
  });
}
