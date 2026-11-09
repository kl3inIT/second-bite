import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/features/identity/ui/register_screen.dart';

import '../../../helpers/helpers.dart';

/// The client's failure for a problem the server answered with.
DioException _problem(String code, int status, String detail) {
  final options = RequestOptions(path: '/auth/accounts');
  return DioException(
    requestOptions: options,
    response: Response(
      requestOptions: options,
      statusCode: status,
      data: <String, Object?>{
        'type': 'urn:secondbite:failure:x',
        'title': 'x',
        'status': status,
        'detail': detail,
        'code': code,
      },
    ),
  );
}

void main() {
  group(RegisterScreen, () {
    late MockAuthRepository auth;

    setUp(() {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => null);
    });

    Future<void> pumpRegister(WidgetTester tester) async {
      tester.view.physicalSize = const Size(1170, 2532);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      await tester.pumpRouterApp(
        GoRouter(
          initialLocation: '/register',
          routes: [
            GoRoute(path: '/', builder: (_, _) => const Text('Trang chủ')),
            GoRoute(
              path: '/sign-in',
              builder: (_, _) => const Text('Đăng nhập ở đây'),
            ),
            GoRoute(
              path: '/register',
              builder: (_, _) => const RegisterScreen(returnTo: '/'),
            ),
          ],
        ),
        auth: auth,
      );
      await tester.pump();
    }

    Future<void> fill(
      WidgetTester tester, {
      required String username,
      required String password,
      String? confirm,
    }) async {
      await tester.enterText(find.byType(TextField).at(0), username);
      await tester.enterText(find.byType(TextField).at(1), password);
      await tester.enterText(find.byType(TextField).at(2), confirm ?? password);
      await tester.tap(find.widgetWithText(FilledButton, 'Tạo tài khoản'));
      await tester.pump();
    }

    void answerRegister(Future<AccountBody> Function() answer) {
      when(
        () => auth.register(
          username: any(named: 'username'),
          password: any(named: 'password'),
        ),
      ).thenAnswer((_) => answer());
    }

    testWidgets('asks for a username and the password twice, nothing else', (
      tester,
    ) async {
      await pumpRegister(tester);

      expect(find.byType(TextField), findsNWidgets(3));
      expect(find.text('Tên đăng nhập'), findsOneWidget);
      expect(find.text('Mật khẩu'), findsOneWidget);
      // The label, and the placeholder that says the same.
      expect(find.text('Nhập lại mật khẩu'), findsNWidgets(2));
      expect(find.text('Đã có tài khoản?'), findsOneWidget);
      for (final at in [1, 2]) {
        expect(
          tester.widget<TextField>(find.byType(TextField).at(at)).obscureText,
          isTrue,
        );
      }
    });

    testWidgets('makes the account and signs in, back to where it was asked', (
      tester,
    ) async {
      answerRegister(() async => sampleAccount);
      await pumpRegister(tester);

      await fill(tester, username: ' Lan.Nguyen ', password: 'mật khẩu dài');
      await tester.pumpAndSettle();

      verify(
        () => auth.register(username: 'Lan.Nguyen', password: 'mật khẩu dài'),
      ).called(1);
      expect(find.text('Trang chủ'), findsOneWidget);
    });

    testWidgets('checks the rules before sending anything', (tester) async {
      await pumpRegister(tester);

      await fill(tester, username: '.lan', password: 'short', confirm: 'other');

      expect(
        find.text(
          'Tên đăng nhập gồm 3 đến 30 ký tự: chữ không dấu, số, dấu chấm, '
          'gạch dưới hoặc gạch ngang.',
        ),
        findsOneWidget,
      );
      expect(find.text('Mật khẩu gồm 8 đến 128 ký tự.'), findsOneWidget);
      expect(find.text('Mật khẩu nhập lại chưa khớp.'), findsOneWidget);
      verifyNever(
        () => auth.register(
          username: any(named: 'username'),
          password: any(named: 'password'),
        ),
      );
    });

    testWidgets('says under the username that it is taken, until it changes', (
      tester,
    ) async {
      answerRegister(
        () => Future.error(
          _problem(
            'IDENTITY_USERNAME_TAKEN',
            409,
            'Tên đăng nhập này đã có người dùng. Chọn một tên khác.',
          ),
        ),
      );
      await pumpRegister(tester);

      await fill(tester, username: 'lan', password: 'password-1');

      const taken = 'Tên đăng nhập này đã có người dùng. Chọn một tên khác.';
      expect(find.text(taken), findsOneWidget);

      await tester.enterText(find.byType(TextField).at(0), 'lan2');
      await tester.pump();
      expect(find.text(taken), findsNothing);
    });

    testWidgets('goes to sign-in in its place when opened on its own', (
      tester,
    ) async {
      await pumpRegister(tester);

      await tester.tap(find.text('Đăng nhập'));
      await tester.pumpAndSettle();

      expect(find.text('Đăng nhập ở đây'), findsOneWidget);
    });
  });
}
