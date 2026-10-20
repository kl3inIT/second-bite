import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/legal/ui/legal_screen.dart';
import 'package:second_bite/features/legal/ui/legal_text.dart';

import '../../../helpers/helpers.dart';

void main() {
  group(AccountScreen, () {
    group('renders', () {
      testWidgets('the signed-out card with the sign-in button', (
        tester,
      ) async {
        await tester.pumpApp(const AccountScreen());
        await tester.pump();

        expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);
        expect(find.widgetWithText(FilledButton, 'Đăng nhập'), findsOneWidget);
        expect(find.text('Đăng xuất'), findsNothing);
      });

      testWidgets('the address and sign-out when signed in', (tester) async {
        await tester.pumpApp(
          const AccountScreen(),
          auth: signedInAs(sampleAccount),
        );
        await tester.pump();

        expect(find.text('lan@gmail.com'), findsOneWidget);
        expect(find.text('Đã đăng nhập'), findsOneWidget);
        expect(
          find.widgetWithText(OutlinedButton, 'Đăng xuất'),
          findsOneWidget,
        );
        expect(find.byIcon(LucideIcons.logOut), findsOneWidget);
      });

      testWidgets('the terms and the privacy policy', (tester) async {
        await tester.pumpApp(const AccountScreen());

        expect(find.text('Điều khoản sử dụng'), findsOneWidget);
        expect(find.text('Chính sách quyền riêng tư'), findsOneWidget);
      });
    });

    testWidgets(
      'offers account settings to someone signed in, and never deletion',
      (tester) async {
        await tester.pumpApp(const AccountScreen());
        await tester.pump();
        expect(find.text('Cài đặt tài khoản'), findsNothing);

        await tester.pumpApp(
          const AccountScreen(),
          auth: signedInAs(sampleAccount),
        );
        await tester.pump();
        expect(find.text('Cài đặt tài khoản'), findsOneWidget);
        expect(find.text('Xoá tài khoản'), findsNothing);
      },
    );

    testWidgets('opens the terms inside the app, as /terms', (tester) async {
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/account',
          routes: [
            GoRoute(path: '/account', builder: (_, _) => const AccountScreen()),
            GoRoute(
              path: '/terms',
              builder: (_, _) =>
                  const LegalScreen(document: LegalDocument.terms),
            ),
          ],
        ),
      );
      await tester.pump();

      await tester.tap(find.text('Điều khoản sử dụng'));
      await tester.pumpAndSettle();

      expect(find.byType(LegalScreen), findsOneWidget);
      expect(find.text('Các mục'), findsOneWidget);
    });

    group('signs out', () {
      testWidgets('and shows the sign-in button again', (tester) async {
        final auth = signedInAs(sampleAccount);
        when(auth.signOut).thenAnswer((_) async {});
        await tester.pumpApp(const AccountScreen(), auth: auth);
        await tester.pump();

        await tester.tap(find.text('Đăng xuất'));
        await tester.pump();

        verify(auth.signOut).called(1);
        expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);
      });
    });
  });
}
