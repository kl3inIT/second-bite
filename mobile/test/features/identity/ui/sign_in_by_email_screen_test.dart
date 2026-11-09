import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/ui/sign_in_by_email_screen.dart';

import '../../../helpers/helpers.dart';

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

void main() {
  group(SignInByEmailScreen, () {
    late MockAuthRepository auth;

    setUp(() {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => null);
    });

    Future<void> pumpSignIn(WidgetTester tester, {String? googleEmail}) async {
      tester.view.physicalSize = const Size(1170, 2532);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/sign-in/email',
          routes: [
            GoRoute(path: '/', builder: (_, _) => const Text('Trang chủ')),
            GoRoute(
              path: '/sign-in',
              builder: (_, _) => const Text('Mật khẩu ở đây'),
            ),
            GoRoute(
              path: '/sign-in/email',
              builder: (_, _) =>
                  SignInByEmailScreen(returnTo: '/', googleEmail: googleEmail),
            ),
          ],
        ),
        auth: auth,
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
      testWidgets('renders the heading, the field, the button, the way back '
          'to the password and the legal line, without Google', (tester) async {
        await pumpSignIn(tester);

        expect(find.text('Đăng nhập bằng email'), findsWidgets);
        expect(find.text('Email'), findsOneWidget);
        expect(find.text('Gửi mã'), findsOneWidget);
        expect(find.text('Đăng nhập bằng tên đăng nhập'), findsOneWidget);
        expect(
          find.textContaining('Điều khoản sử dụng', findRichText: true),
          findsOneWidget,
        );
        expect(find.text('Tiếp tục với Google'), findsNothing);
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

        expect(find.text('Gửi mã'), findsOneWidget);
      });
    });

    testWidgets('fills in the address Google gave and says why', (
      tester,
    ) async {
      await pumpSignIn(tester, googleEmail: 'lan@company.vn');

      expect(find.text('Email này đã có tài khoản'), findsOneWidget);
      expect(
        find.text(
          'lan@company.vn đã có tài khoản Second Bite. '
          'Nhận mã qua email này để đăng nhập.',
        ),
        findsOneWidget,
      );
      expect(find.text('Gửi mã đến email này'), findsOneWidget);
      expect(
        tester.widget<TextField>(find.byType(TextField)).controller!.text,
        'lan@company.vn',
      );
    });

    testWidgets('goes back to the username and the password', (tester) async {
      await pumpSignIn(tester);

      await tester.tap(find.text('Đăng nhập bằng tên đăng nhập'));
      await tester.pumpAndSettle();

      expect(find.text('Mật khẩu ở đây'), findsOneWidget);
    });

    testWidgets('leaves at once for someone already signed in', (tester) async {
      when(auth.currentAccount).thenAnswer((_) async => sampleAccount);
      await pumpSignIn(tester);
      await tester.pumpAndSettle();

      expect(find.text('Trang chủ'), findsOneWidget);
    });
  });
}
