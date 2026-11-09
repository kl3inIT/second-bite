import 'dart:convert';

import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/data/apple_auth.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';

import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import '../../../helpers/helpers.dart';

class _MockGoogleAuth extends Mock implements GoogleAuth;

class _MockAppleAuth extends Mock implements AppleAuth;

/// The words the server answers with, in Vietnamese (server/internal/*/errors.go).
const _serverWords = {
  'IDENTITY_CREDENTIALS_INCORRECT': 'Tên đăng nhập hoặc mật khẩu chưa đúng.',
  'IDENTITY_SIGN_IN_LIMIT_EXCEEDED':
      'Bạn đã nhập sai quá nhiều lần. Đợi một lúc rồi thử lại.',
};

/// The client's failure for a problem the server answered with.
DioException _problem(String code, int status) {
  final options = RequestOptions(path: '/auth');
  return DioException(
    requestOptions: options,
    response: Response(
      requestOptions: options,
      statusCode: status,
      data: <String, Object?>{
        'type': 'urn:secondbite:failure:x',
        'title': 'x',
        'status': status,
        'detail': ?_serverWords[code],
        'code': code,
      },
    ),
  );
}

/// A Google ID token naming [email], unsigned: only its claims are read.
String _idToken(String email) {
  String part(Object value) =>
      base64Url.encode(utf8.encode(jsonEncode(value))).replaceAll('=', '');
  return '${part({'alg': 'none'})}.${part({'email': email})}.sig';
}

void main() {
  group(SignInScreen, () {
    late MockAuthRepository auth;
    late GoogleAuth google;
    late AppleAuth apple;

    setUp(() {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => null);
      when(auth.googleClientId).thenAnswer((_) async => null);
      google = _MockGoogleAuth();
      when(() => google.available).thenReturn(true);
      apple = _MockAppleAuth();
      when(() => apple.available).thenReturn(false);
      when(auth.appleOffered).thenAnswer((_) async => true);
    });

    Future<void> pumpSignIn(WidgetTester tester) async {
      tester.view.physicalSize = const Size(1170, 2532);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/sign-in',
          routes: [
            GoRoute(path: '/', builder: (_, _) => const Text('Trang chủ')),
            GoRoute(
              path: '/sign-in',
              builder: (_, _) => const SignInScreen(returnTo: '/'),
            ),
            GoRoute(
              path: '/sign-in/email',
              builder: (_, state) => Text(
                'Email: ${state.uri.queryParameters['google-email'] ?? '-'}',
              ),
            ),
            GoRoute(
              path: '/register',
              builder: (_, _) => const Text('Đăng ký ở đây'),
            ),
          ],
        ),
        auth: auth,
        overrides: [
          googleAuthProvider.overrideWithValue(google),
          appleAuthProvider.overrideWithValue(apple),
        ],
      );
      await tester.pump();
    }

    Future<void> signIn(
      WidgetTester tester,
      String username,
      String password,
    ) async {
      await tester.enterText(find.byType(TextField).at(0), username);
      await tester.enterText(find.byType(TextField).at(1), password);
      await tester.tap(find.widgetWithText(FilledButton, 'Đăng nhập'));
      await tester.pump();
    }

    void answerPassword(Future<AccountBody> Function() answer) {
      when(
        () => auth.signInWithPassword(
          username: any(named: 'username'),
          password: any(named: 'password'),
        ),
      ).thenAnswer((_) => answer());
    }

    testWidgets('opens on the username and the password, then the other ways '
        'in, without Google when the server does not offer it', (tester) async {
      await pumpSignIn(tester);

      expect(find.text('Đăng nhập để đặt món'), findsOneWidget);
      expect(find.text('Tên đăng nhập'), findsOneWidget);
      expect(find.text('Mật khẩu'), findsOneWidget);
      expect(find.text('Đăng nhập bằng email'), findsOneWidget);
      expect(find.text('Chưa có tài khoản?'), findsOneWidget);
      expect(find.text('Đăng ký'), findsOneWidget);
      expect(
        find.textContaining('Điều khoản sử dụng', findRichText: true),
        findsOneWidget,
      );
      expect(find.byType(AppGoogleButton), findsNothing);
      final password = tester.widget<TextField>(find.byType(TextField).at(1));
      expect(password.obscureText, isTrue);
    });

    testWidgets('signs in with the username trimmed and the password as typed, '
        'back to where sign-in was asked', (tester) async {
      answerPassword(() async => sampleAccount);
      await pumpSignIn(tester);

      await signIn(tester, ' Lan ', ' bí mật 1 ');
      await tester.pumpAndSettle();

      verify(
        () => auth.signInWithPassword(username: 'Lan', password: ' bí mật 1 '),
      ).called(1);
      expect(find.text('Trang chủ'), findsOneWidget);
    });

    testWidgets('asks for both fields before sending anything', (tester) async {
      await pumpSignIn(tester);

      await signIn(tester, '  ', '');

      expect(find.text('Nhập tên đăng nhập.'), findsOneWidget);
      expect(find.text('Nhập mật khẩu.'), findsOneWidget);
      verifyNever(
        () => auth.signInWithPassword(
          username: any(named: 'username'),
          password: any(named: 'password'),
        ),
      );

      await tester.enterText(find.byType(TextField).at(0), 'lan');
      await tester.pump();
      expect(find.text('Nhập tên đăng nhập.'), findsNothing);
    });

    testWidgets("says a wrong password in the server's words and clears it", (
      tester,
    ) async {
      answerPassword(
        () => Future.error(_problem('IDENTITY_CREDENTIALS_INCORRECT', 400)),
      );
      await pumpSignIn(tester);

      await signIn(tester, 'lan', 'wrong-password');

      expect(
        find.text('Tên đăng nhập hoặc mật khẩu chưa đúng.'),
        findsOneWidget,
      );
      expect(
        tester.widget<TextField>(find.byType(TextField).at(1)).controller!.text,
        isEmpty,
      );
      expect(
        tester.widget<TextField>(find.byType(TextField).at(0)).controller!.text,
        'lan',
      );
    });

    testWidgets('says when too many wrong passwords were tried', (
      tester,
    ) async {
      answerPassword(
        () => Future.error(_problem('IDENTITY_SIGN_IN_LIMIT_EXCEEDED', 429)),
      );
      await pumpSignIn(tester);

      await signIn(tester, 'lan', 'password-1');

      expect(
        find.text('Bạn đã nhập sai quá nhiều lần. Đợi một lúc rồi thử lại.'),
        findsOneWidget,
      );
    });

    testWidgets('opens the emailed code on its own screen', (tester) async {
      await pumpSignIn(tester);

      await tester.tap(find.text('Đăng nhập bằng email'));
      await tester.pumpAndSettle();

      expect(find.text('Email: -'), findsOneWidget);
    });

    testWidgets('opens the register screen', (tester) async {
      await pumpSignIn(tester);

      await tester.tap(find.text('Đăng ký'));
      await tester.pumpAndSettle();

      expect(find.text('Đăng ký ở đây'), findsOneWidget);
    });

    group('Google', () {
      setUp(() {
        when(auth.googleClientId).thenAnswer((_) async => 'web-client');
      });

      testWidgets('is offered under the emailed code', (tester) async {
        await pumpSignIn(tester);

        expect(find.text('Tiếp tục với Google'), findsOneWidget);
        expect(find.text('hoặc'), findsOneWidget);
      });

      testWidgets('is hidden where this build cannot sign in with it', (
        tester,
      ) async {
        when(() => google.available).thenReturn(false);
        await pumpSignIn(tester);

        expect(find.byType(AppGoogleButton), findsNothing);
      });

      testWidgets('signs in with the token and its nonce', (tester) async {
        when(() => google.signIn('web-client')).thenAnswer(
          (_) async => (idToken: _idToken('lan@gmail.com'), nonce: 'n-1'),
        );
        when(
          () => auth.signInWithGoogle(
            idToken: any(named: 'idToken'),
            nonce: 'n-1',
          ),
        ).thenAnswer((_) async => sampleAccount);
        await pumpSignIn(tester);

        await tester.tap(find.text('Tiếp tục với Google'));
        await tester.pumpAndSettle();

        expect(find.text('Trang chủ'), findsOneWidget);
      });

      testWidgets('does nothing when Google is closed', (tester) async {
        when(() => google.signIn(any())).thenAnswer((_) async => null);
        await pumpSignIn(tester);

        await tester.tap(find.text('Tiếp tục với Google'));
        await tester.pump();

        expect(find.text('Đăng nhập để đặt món'), findsOneWidget);
        verifyNever(
          () => auth.signInWithGoogle(
            idToken: any(named: 'idToken'),
            nonce: any(named: 'nonce'),
          ),
        );
      });

      testWidgets('opens the emailed code with the address when it needs it', (
        tester,
      ) async {
        when(() => google.signIn(any())).thenAnswer(
          (_) async => (idToken: _idToken('lan@company.vn'), nonce: 'n-1'),
        );
        when(
          () => auth.signInWithGoogle(
            idToken: any(named: 'idToken'),
            nonce: any(named: 'nonce'),
          ),
        ).thenThrow(_problem('IDENTITY_GOOGLE_LINK_REQUIRED', 409));
        await pumpSignIn(tester);

        await tester.tap(find.text('Tiếp tục với Google'));
        await tester.pumpAndSettle();

        expect(find.text('Email: lan@company.vn'), findsOneWidget);
      });
    });

    group('Apple (SEC-38)', () {
      const credential = (
        idToken: 'header.eyJlbWFpbCI6Imxhbi5uZ3V5ZW5AeWFob28uY29tIn0.sig',
        nonce: 'n-1',
        authorizationCode: 'code-1',
        givenName: 'Lan',
        familyName: 'Nguyễn',
      );

      setUp(() {
        when(() => apple.available).thenReturn(true);
      });

      testWidgets('is offered on iOS when the server offers it', (
        tester,
      ) async {
        await pumpSignIn(tester);

        expect(find.byType(SignInWithAppleButton), findsOneWidget);
        expect(find.text('Tiếp tục với Apple'), findsOneWidget);
      });

      testWidgets('is hidden when the server does not offer it', (
        tester,
      ) async {
        when(auth.appleOffered).thenAnswer((_) async => false);
        await pumpSignIn(tester);

        expect(find.byType(SignInWithAppleButton), findsNothing);
      });

      testWidgets('is hidden, and the server not asked, off iOS', (
        tester,
      ) async {
        when(() => apple.available).thenReturn(false);
        await pumpSignIn(tester);

        expect(find.byType(SignInWithAppleButton), findsNothing);
        verifyNever(auth.appleOffered);
      });

      testWidgets('signs in with what Apple handed back', (tester) async {
        when(apple.signIn).thenAnswer((_) async => credential);
        when(() => auth.signInWithApple(credential))
            .thenAnswer((_) async => sampleAccount);
        await pumpSignIn(tester);

        await tester.tap(find.byType(SignInWithAppleButton));
        await tester.pumpAndSettle();

        expect(find.text('Trang chủ'), findsOneWidget);
      });

      testWidgets('does nothing when Apple is closed', (tester) async {
        when(apple.signIn).thenAnswer((_) async => null);
        await pumpSignIn(tester);

        await tester.tap(find.byType(SignInWithAppleButton));
        await tester.pump();

        expect(find.text('Đăng nhập để đặt món'), findsOneWidget);
        verifyNever(() => auth.signInWithApple(credential));
      });

      testWidgets('opens the emailed code with the address when it needs it', (
        tester,
      ) async {
        when(apple.signIn).thenAnswer((_) async => credential);
        when(() => auth.signInWithApple(credential))
            .thenThrow(_problem('IDENTITY_APPLE_LINK_REQUIRED', 409));
        await pumpSignIn(tester);

        await tester.tap(find.byType(SignInWithAppleButton));
        await tester.pumpAndSettle();

        expect(find.text('Email: lan.nguyen@yahoo.com'), findsOneWidget);
      });
    });

    testWidgets('leaves at once for someone already signed in', (tester) async {
      when(auth.currentAccount).thenAnswer((_) async => sampleAccount);
      await pumpSignIn(tester);
      await tester.pumpAndSettle();

      expect(find.text('Trang chủ'), findsOneWidget);
    });
  });
}
