import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/routes.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/account_screen.dart';
import 'package:second_bite/features/identity/ui/account_settings_screen.dart';
import 'package:second_bite/features/identity/ui/delete_account_screen.dart';

import '../helpers/helpers.dart';

class _MockGoogleAuth extends Mock implements GoogleAuth;

// SEC-69: signing in again from account settings or from the deletion comes
// back to that screen, with its way back, instead of a screen with no back
// and no tabs.
void main() {
  group('the app routes', () {
    late MockAuthRepository auth;
    late GoogleAuth google;

    setUp(() {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => null);
      when(auth.googleClientId).thenAnswer((_) async => null);
      when(() => auth.requestCode('lan@gmail.com'))
          .thenAnswer((_) async => 'ch-1');
      when(() => auth.signIn(challengeId: 'ch-1', code: '123456'))
          .thenAnswer((_) async => sampleAccount);
      google = _MockGoogleAuth();
      when(() => google.available).thenReturn(false);
    });

    Future<void> pumpAt(WidgetTester tester, String location) async {
      tester.view.physicalSize = const Size(1170, 2532);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpRouterApp(
        GoRouter(
          navigatorKey: rootNavigatorKey,
          initialLocation: location,
          routes: $appRoutes,
        ),
        auth: auth,
        overrides: [
          googleAuthProvider.overrideWithValue(google),
          mySellersProvider.overrideWith((_) async => []),
          ownedSellerNamesProvider.overrideWith((_) async => []),
        ],
      );
      await tester.pumpAndSettle();
    }

    Future<void> signInWithCode(WidgetTester tester) async {
      final signIn = find.widgetWithText(FilledButton, 'Đăng nhập');
      await tester.ensureVisible(signIn);
      await tester.pumpAndSettle();
      await tester.tap(signIn);
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), 'lan@gmail.com');
      await tester.tap(find.text('Gửi mã'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), '123456');
      await tester.pumpAndSettle();
    }

    testWidgets('account settings is at /account/settings, as on the web', (
      tester,
    ) async {
      expect(const AccountSettingsRoute().location, '/account/settings');
    });

    testWidgets(
      'signing in from account settings comes back to it, then to the tab',
      (tester) async {
        await pumpAt(tester, '/account/settings');
        expect(find.text('Bạn chưa đăng nhập'), findsOneWidget);

        await signInWithCode(tester);

        expect(find.byType(AccountSettingsScreen), findsOneWidget);
        expect(find.text('lan@gmail.com'), findsWidgets);
        await tester.tap(find.byType(BackButton));
        await tester.pumpAndSettle();
        expect(find.byType(AccountScreen), findsOneWidget);
        expect(find.text('Đã đăng nhập'), findsOneWidget);
      },
    );

    testWidgets('signing in from the deletion comes back to the deletion', (
      tester,
    ) async {
      await pumpAt(tester, '/account/settings');
      // The deletion, opened from the foot of settings.
      unawaited(
        GoRouter.of(tester.element(find.byType(AccountSettingsScreen)))
            .push<void>('/delete-account'),
      );
      await tester.pumpAndSettle();
      expect(find.text('Đăng nhập để xoá tài khoản'), findsOneWidget);

      await signInWithCode(tester);

      expect(find.byType(DeleteAccountScreen), findsOneWidget);
      expect(find.text('Gửi mã xác nhận'), findsOneWidget);
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();
      expect(find.byType(AccountSettingsScreen), findsOneWidget);
    });
  });
}
