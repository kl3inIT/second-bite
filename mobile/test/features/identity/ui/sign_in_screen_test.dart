import 'dart:convert';

import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/sign_in_screen.dart';

import '../../../helpers/helpers.dart';

class _MockGoogleAuth extends Mock implements GoogleAuth;

/// The words the server answers with, in Vietnamese (server/internal/*/errors.go).
const _serverWords = {
  'IDENTITY_EMAIL_INVALID': 'Nhập một địa chỉ email, ví dụ ten@gmail.com.',
  'IDENTITY_CODE_LIMIT_EXCEEDED':
      'Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại.',
  'IDENTITY_CODE_INCORRECT':
      'Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.',
  'IDENTITY_CHALLENGE_GONE': 'Mã này đã hết hạn hoặc đã dùng. Gửi lại mã mới.',
  'PLATFORM_INTERNAL_FAILURE': 'Đã có lỗi ngoài ý muốn. Thử lại sau ít phút.',
};

/// The client's failure for a problem the server answered with.
DioException _problem(String code, int status, {String? requestId}) {
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
        'requestId': ?requestId,
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

    setUp(() {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => null);
      when(auth.googleClientId).thenAnswer((_) async => null);
      google = _MockGoogleAuth();
      when(() => google.available).thenReturn(true);
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
          ],
        ),
        auth: auth,
        overrides: [googleAuthProvider.overrideWithValue(google)],
      );
      await tester.pump();
    }

    Future<void> sendCode(WidgetTester tester) async {
      when(() => auth.requestCode('lan@gmail.com'))
          .thenAnswer((_) async => 'ch-1');
      await tester.enterText(find.byType(TextField), ' lan@gmail.com ');
      await tester.tap(find.text('Gửi mã'));
      await tester.pump();
    }

    void answerCode(Future<AccountBody> Function() answer) {
      when(
        () => auth.signIn(
          challengeId: any(named: 'challengeId'),
          code: any(named: 'code'),
        ),
      ).thenAnswer((_) => answer());
    }

    group('the email step', () {
      testWidgets('renders the heading, the field, the button and the legal '
          'line, without Google when the server does not offer it', (
        tester,
      ) async {
        await pumpSignIn(tester);

        expect(find.text('Đăng nhập'), findsOneWidget);
        expect(find.text('Đăng nhập để đặt món'), findsOneWidget);
        expect(find.text('Email'), findsOneWidget);
        expect(find.text('Gửi mã'), findsOneWidget);
        expect(
          find.textContaining('Điều khoản sử dụng', findRichText: true),
          findsOneWidget,
        );
        expect(find.byType(AppGoogleButton), findsNothing);
      });

      testWidgets('shows Google first when the server offers it', (
        tester,
      ) async {
        when(auth.googleClientId).thenAnswer((_) async => 'web-client');
        await pumpSignIn(tester);

        expect(find.text('Tiếp tục với Google'), findsOneWidget);
        expect(find.text('hoặc dùng email'), findsOneWidget);
      });

      testWidgets('hides Google where this build cannot sign in with it', (
        tester,
      ) async {
        when(auth.googleClientId).thenAnswer((_) async => 'web-client');
        when(() => google.available).thenReturn(false);
        await pumpSignIn(tester);

        expect(find.byType(AppGoogleButton), findsNothing);
      });

      testWidgets('says when the address is not one', (tester) async {
        when(() => auth.requestCode(any()))
            .thenThrow(_problem('IDENTITY_EMAIL_INVALID', 422));
        await pumpSignIn(tester);

        await tester.enterText(find.byType(TextField), 'lan');
        await tester.tap(find.text('Gửi mã'));
        await tester.pump();

        expect(
          find.text('Nhập một địa chỉ email, ví dụ ten@gmail.com.'),
          findsOneWidget,
        );
      });

      testWidgets('says when too many codes were asked for', (tester) async {
        when(() => auth.requestCode(any()))
            .thenThrow(_problem('IDENTITY_CODE_LIMIT_EXCEEDED', 429));
        await pumpSignIn(tester);

        await tester.enterText(find.byType(TextField), 'limit@example.com');
        await tester.tap(find.text('Gửi mã'));
        await tester.pump();

        expect(
          find.text(
            'Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại.',
          ),
          findsOneWidget,
        );
      });

      testWidgets('gives the reference of any other failure', (tester) async {
        when(() => auth.requestCode(any())).thenThrow(
          _problem('PLATFORM_INTERNAL_FAILURE', 500, requestId: 'REQ-9'),
        );
        await pumpSignIn(tester);

        await tester.enterText(find.byType(TextField), 'lan@gmail.com');
        await tester.tap(find.text('Gửi mã'));
        await tester.pump();

        expect(
          find.text(
            'Đã có lỗi ngoài ý muốn. Thử lại sau ít phút. Mã tham chiếu: REQ-9',
          ),
          findsOneWidget,
        );
      });

      testWidgets('says it in its own words when no answer came', (
        tester,
      ) async {
        when(() => auth.requestCode(any())).thenThrow(
          DioException(requestOptions: RequestOptions(path: '/auth')),
        );
        await pumpSignIn(tester);

        await tester.enterText(find.byType(TextField), 'lan@gmail.com');
        await tester.tap(find.text('Gửi mã'));
        await tester.pump();

        expect(
          find.text('Chưa đăng nhập được. Vui lòng thử lại.'),
          findsOneWidget,
        );
      });
    });

    group('the code step', () {
      testWidgets('names the address, the spam folder and the wait', (
        tester,
      ) async {
        await pumpSignIn(tester);
        await sendCode(tester);

        expect(find.text('Kiểm tra email của bạn'), findsOneWidget);
        expect(
          find.textContaining(
            'Mã đăng nhập 6 số đã gửi đến lan@gmail.com.',
            findRichText: true,
          ),
          findsOneWidget,
        );
        expect(
          find.text('Chưa thấy email? Xem trong thư rác (Spam).'),
          findsOneWidget,
        );
        expect(find.text('Gửi lại mã sau 1:00'), findsOneWidget);
      });

      testWidgets('counts down, then offers a new code', (tester) async {
        await pumpSignIn(tester);
        await sendCode(tester);

        await tester.pump(const Duration(seconds: 32));
        expect(find.text('Gửi lại mã sau 0:28'), findsOneWidget);

        await tester.pump(const Duration(seconds: 28));
        expect(find.text('Gửi lại mã'), findsOneWidget);

        await tester.tap(find.text('Gửi lại mã'));
        await tester.pump();
        verify(() => auth.requestCode('lan@gmail.com')).called(2);
        expect(find.text('Gửi lại mã sau 1:00'), findsOneWidget);
      });

      testWidgets('keeps only the digits of a paste and signs in at six, '
          'back to where sign-in was asked', (tester) async {
        answerCode(() async => sampleAccount);
        await pumpSignIn(tester);
        await sendCode(tester);

        await tester.enterText(find.byType(TextField), '12 34\n56');
        await tester.pumpAndSettle();

        verify(() => auth.signIn(challengeId: 'ch-1', code: '123456'))
            .called(1);
        expect(find.text('Trang chủ'), findsOneWidget);
      });

      testWidgets('confirms with the button', (tester) async {
        answerCode(() async => sampleAccount);
        await pumpSignIn(tester);
        await sendCode(tester);
        final confirm = find.widgetWithText(FilledButton, 'Xác nhận');
        expect(tester.widget<FilledButton>(confirm).onPressed, isNull);

        await tester.enterText(find.byType(TextField), '12345');
        await tester.pump();
        expect(tester.widget<FilledButton>(confirm).onPressed, isNull);

        // A sixth digit submits by itself; the button offers the same.
        answerCode(
          () => Future.delayed(const Duration(seconds: 1), () {
            return sampleAccount;
          }),
        );
        await tester.enterText(find.byType(TextField), '123456');
        await tester.pump();
        expect(find.text('Đang xác nhận…'), findsOneWidget);
        await tester.pumpAndSettle(const Duration(seconds: 1));
        expect(find.text('Trang chủ'), findsOneWidget);
      });

      testWidgets('clears a wrong code and says so', (tester) async {
        answerCode(
          () => Future.error(_problem('IDENTITY_CODE_INCORRECT', 422)),
        );
        await pumpSignIn(tester);
        await sendCode(tester);

        await tester.enterText(find.byType(TextField), '111111');
        await tester.pump();

        expect(
          find.text('Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.'),
          findsOneWidget,
        );
        expect(
          tester.widget<TextField>(find.byType(TextField)).controller!.text,
          isEmpty,
        );
        expect(find.text('Kiểm tra email của bạn'), findsOneWidget);
      });

      testWidgets('offers a new code at once when the code is gone', (
        tester,
      ) async {
        answerCode(
          () => Future.error(_problem('IDENTITY_CHALLENGE_GONE', 410)),
        );
        await pumpSignIn(tester);
        await sendCode(tester);

        await tester.enterText(find.byType(TextField), '123456');
        await tester.pump();

        expect(
          find.text('Mã này đã hết hạn hoặc đã dùng. Gửi lại mã mới.'),
          findsOneWidget,
        );
        expect(find.text('Gửi lại mã'), findsOneWidget);
      });

      testWidgets('goes back to the address with "Đổi email"', (tester) async {
        await pumpSignIn(tester);
        await sendCode(tester);

        await tester.tapOnText(find.textRange.ofSubstring('Đổi email'));
        await tester.pump();

        expect(find.text('Đăng nhập để đặt món'), findsOneWidget);
      });
    });

    group('Google', () {
      setUp(() {
        when(auth.googleClientId).thenAnswer((_) async => 'web-client');
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

      testWidgets('asks for the emailed code when the address needs it', (
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
        await tester.pump();

        expect(find.text('Email này đã có tài khoản'), findsOneWidget);
        expect(
          find.text(
            'lan@company.vn đã có tài khoản Second Bite. '
            'Nhận mã qua email này để đăng nhập.',
          ),
          findsOneWidget,
        );
        expect(find.text('Gửi mã đến email này'), findsOneWidget);
        expect(find.byType(AppGoogleButton), findsNothing);
        expect(
          tester.widget<TextField>(find.byType(TextField)).controller!.text,
          'lan@company.vn',
        );
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
