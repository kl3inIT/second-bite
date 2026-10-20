import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:second_bite/features/identity/ui/account_settings_screen.dart';
import 'package:second_bite/features/identity/ui/delete_account_screen.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(AccountSettingsScreen, () {
    testWidgets('shows the account, its shops and the way to deletion', (
      tester,
    ) async {
      await tester.pumpApp(
        const AccountSettingsScreen(),
        auth: signedInAs(sampleAccount),
        overrides: [
          mySellersProvider.overrideWith(
            (_) async => [
              (name: 'Bánh mì Tasco', owner: true),
              (name: 'Phở Hà', owner: false),
            ],
          ),
        ],
      );
      await tester.pumpAndSettle();

      expect(find.text('lan@gmail.com'), findsNWidgets(2));
      expect(find.text('Chưa có'), findsOneWidget);
      expect(
        find.text('Bánh mì Tasco · Chủ quán, Phở Hà · Nhân viên'),
        findsOneWidget,
      );
      expect(find.text('Tiếng Việt'), findsOneWidget);
      expect(find.text('Xoá tài khoản'), findsNWidgets(2));
    });

    testWidgets('hides the shops row for someone with none', (tester) async {
      await tester.pumpApp(
        const AccountSettingsScreen(),
        auth: signedInAs(sampleAccount),
        overrides: [mySellersProvider.overrideWith((_) async => [])],
      );
      await tester.pumpAndSettle();

      expect(find.text('Quán của bạn'), findsNothing);
    });

    testWidgets('opens the deletion from its foot', (tester) async {
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/account-settings',
          routes: [
            GoRoute(
              path: '/account-settings',
              builder: (_, _) => const AccountSettingsScreen(),
            ),
            GoRoute(
              path: '/delete-account',
              builder: (_, _) => const DeleteAccountScreen(),
            ),
          ],
        ),
        auth: signedInAs(sampleAccount),
        overrides: [
          mySellersProvider.overrideWith((_) async => []),
          ownedSellerNamesProvider.overrideWith((_) async => []),
        ],
      );
      await tester.pumpAndSettle();

      await tester.tap(find.widgetWithText(OutlinedButton, 'Xoá tài khoản'));
      await tester.pumpAndSettle();

      expect(find.byType(DeleteAccountScreen), findsOneWidget);
    });

    testWidgets('asks someone signed out to sign in', (tester) async {
      await tester.pumpApp(const AccountSettingsScreen());
      await tester.pump();

      expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);
      expect(find.text('Xoá tài khoản'), findsNothing);
    });
  });
}
