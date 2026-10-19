import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../helpers/helpers.dart';

void main() {
  group(AppAlert, () {
    testWidgets('renders its icon, title and description', (tester) async {
      await tester.pumpApp(
        const AppAlert(
          icon: LucideIcons.mailWarning,
          title: 'Email này đã có tài khoản',
          description: 'Nhận mã qua email này để đăng nhập.',
        ),
      );

      expect(find.byIcon(LucideIcons.mailWarning), findsOneWidget);
      expect(find.text('Email này đã có tài khoản'), findsOneWidget);
      expect(find.text('Nhận mã qua email này để đăng nhập.'), findsOneWidget);
    });
  });
}
