import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
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

    testWidgets('sets the display name in a sheet', (tester) async {
      final auth = signedInAs(sampleAccount);
      when(() => auth.setDisplayName('  Trần Thị Lan ')).thenAnswer(
        (_) async => const AccountBody(
          id: 'ac-1',
          email: 'lan@gmail.com',
          displayName: 'Trần Thị Lan',
          role: AccountBodyRole.customer,
        ),
      );
      await tester.pumpApp(
        const AccountSettingsScreen(),
        auth: auth,
        overrides: [mySellersProvider.overrideWith((_) async => [])],
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Chưa có'));
      await tester.pumpAndSettle();
      expect(find.text('Sửa tên hiển thị'), findsOneWidget);

      await tester.enterText(find.byType(TextField), '  Trần Thị Lan ');
      await tester.tap(find.text('Lưu'));
      await tester.pumpAndSettle();

      verify(() => auth.setDisplayName('  Trần Thị Lan ')).called(1);
      expect(find.text('Sửa tên hiển thị'), findsNothing);
      expect(find.text('Trần Thị Lan'), findsNWidgets(2));
    });

    testWidgets("shows the server's words when it refuses a name", (
      tester,
    ) async {
      final auth = signedInAs(sampleAccount);
      final options = RequestOptions(path: '/accounts/me');
      when(() => auth.setDisplayName(any())).thenThrow(
        DioException(
          requestOptions: options,
          response: Response(
            requestOptions: options,
            statusCode: 400,
            data: <String, Object?>{
              'status': 400,
              'detail': 'Nhập tên hiển thị từ 1 đến 50 ký tự.',
              'code': 'IDENTITY_DISPLAY_NAME_INVALID',
            },
          ),
        ),
      );
      await tester.pumpApp(
        const AccountSettingsScreen(),
        auth: auth,
        overrides: [mySellersProvider.overrideWith((_) async => [])],
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Chưa có'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), '   ');
      await tester.tap(find.text('Lưu'));
      await tester.pumpAndSettle();

      expect(find.text('Nhập tên hiển thị từ 1 đến 50 ký tự.'), findsOneWidget);
      expect(find.text('Sửa tên hiển thị'), findsOneWidget);
    });

    testWidgets('asks someone signed out to sign in', (tester) async {
      await tester.pumpApp(const AccountSettingsScreen());
      await tester.pump();

      expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);
      expect(find.text('Xoá tài khoản'), findsNothing);
    });
  });
}
