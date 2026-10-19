import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(AccountScreen, () {
    group('renders', () {
      testWidgets('the signed-out card without a sign-in action', (
        tester,
      ) async {
        await tester.pumpApp(const AccountScreen());

        expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);
        expect(find.byType(FilledButton), findsNothing);
      });

      testWidgets('the terms and the privacy policy', (tester) async {
        await tester.pumpApp(const AccountScreen());

        expect(find.text('Điều khoản sử dụng'), findsOneWidget);
        expect(find.text('Chính sách quyền riêng tư'), findsOneWidget);
      });
    });
  });
}
