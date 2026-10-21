import 'dart:async';

import 'package:app_ui/app_ui.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/features/identity/ui/delete_account_screen.dart';

import '../../../helpers/helpers.dart';

/// The client's failure for a problem the server answered with.
DioException _problem(String code, int status) {
  final options = RequestOptions(path: '/accounts/me/deletion');
  return DioException(
    requestOptions: options,
    response: Response(
      requestOptions: options,
      statusCode: status,
      data: <String, Object?>{
        'status': status,
        'detail': 'Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.',
        'code': code,
      },
    ),
  );
}

extension on WidgetTester {
  /// Scrolls [finder] into view, then taps it: the screen is longer than the
  /// test's surface.
  Future<void> tapVisible(Finder finder) async {
    await ensureVisible(finder);
    await pumpAndSettle();
    await tap(finder);
  }
}

void main() {
  group(DeleteAccountScreen, () {
    testWidgets('tells someone signed out what goes and asks them to sign in', (
      tester,
    ) async {
      await tester.pumpApp(const DeleteAccountScreen());
      await tester.pump();

      expect(find.text('Bị xoá ngay khi bạn xác nhận'), findsOneWidget);
      expect(find.text('Được giữ lại, không còn gắn với bạn'), findsOneWidget);
      expect(find.text('Đăng nhập để xoá tài khoản'), findsOneWidget);
      expect(find.text('Gửi mã xác nhận'), findsNothing);
    });

    testWidgets('deletes with the emailed code, after a wrong one', (
      tester,
    ) async {
      final auth = signedInAs(sampleAccount);
      when(auth.requestDeletionCode).thenAnswer((_) async => 'del-1');
      when(() => auth.deleteAccount(challengeId: 'del-1', code: '111111'))
          .thenThrow(_problem('IDENTITY_CODE_INCORRECT', 422));
      when(() => auth.deleteAccount(challengeId: 'del-1', code: '123456'))
          .thenAnswer((_) async {});
      when(auth.signOut).thenAnswer((_) async {});

      await tester.pumpApp(
        const DeleteAccountScreen(),
        auth: auth,
        overrides: [ownedSellerNamesProvider.overrideWith((_) async => [])],
      );
      await tester.pump();

      expect(find.textContaining('lan@gmail.com'), findsOneWidget);
      expect(find.text('Bạn đang là chủ quán'), findsNothing);

      await tester.tapVisible(find.text('Gửi mã xác nhận'));
      await tester.pumpAndSettle();
      expect(find.text('Nhập mã xác nhận'), findsOneWidget);

      final confirm = find.widgetWithText(
        FilledButton,
        'Xoá vĩnh viễn tài khoản',
      );
      expect(tester.widget<FilledButton>(confirm).onPressed, isNull);

      await tester.enterText(find.byType(TextField), '111111');
      await tester.pump();
      await tester.tapVisible(confirm);
      await tester.pumpAndSettle();
      expect(
        find.text('Mã chưa đúng. Xem lại email mới nhất rồi nhập lại.'),
        findsOneWidget,
      );

      await tester.enterText(find.byType(TextField), '123456');
      await tester.pump();
      await tester.tapVisible(confirm);
      await tester.pumpAndSettle();

      verify(() => auth.deleteAccount(challengeId: 'del-1', code: '123456'))
          .called(1);
      expect(find.text('Đã xoá tài khoản'), findsOneWidget);
      expect(find.text('Đăng nhập để xoá tài khoản'), findsNothing);
      // Figma Q5a: only the confirmation.
      expect(find.text('Được giữ lại, không còn gắn với bạn'), findsNothing);
    });

    testWidgets('holds the code until the shops are read, and reads them '
        'again after a failure', (tester) async {
      final auth = signedInAs(sampleAccount);
      final reads = Completer<List<String>>();
      var attempts = 0;
      await tester.pumpApp(
        const DeleteAccountScreen(),
        auth: auth,
        overrides: [
          ownedSellerNamesProvider.overrideWith((_) {
            attempts++;
            if (attempts == 1) return reads.future;
            return Future.value(['Bánh mì Tasco']);
          }),
        ],
      );
      await tester.pump();
      FilledButton send() => tester.widget<FilledButton>(
        find.widgetWithText(FilledButton, 'Gửi mã xác nhận'),
      );

      // Still reading: no code yet, and no "owns nothing" either.
      expect(send().onPressed, isNull);
      expect(
        find.text(
          'Khi bạn nhập đúng mã, tài khoản bị xoá ngay và không thể hoàn tác.',
        ),
        findsOneWidget,
      );

      reads.completeError(Exception('offline'));
      await tester.pumpAndSettle();
      expect(send().onPressed, isNull);
      expect(find.textContaining('Chưa đọc được các quán'), findsOneWidget);
      expect(find.text('Bạn đang là chủ quán'), findsNothing);

      await tester.tapVisible(find.widgetWithText(OutlinedButton, 'Thử lại'));
      await tester.pumpAndSettle();
      expect(find.text('Bạn đang là chủ quán'), findsOneWidget);
      expect(find.textContaining('Chưa đọc được các quán'), findsNothing);
      expect(send().onPressed, isNotNull);
      verifyNever(auth.requestDeletionCode);
    });

    group('with the app around it', () {
      late MockAuthRepository auth;

      setUp(() {
        auth = signedInAs(sampleAccount) as MockAuthRepository;
        when(auth.requestDeletionCode).thenAnswer((_) async => 'del-1');
        when(() => auth.deleteAccount(challengeId: 'del-1', code: '123456'))
            .thenAnswer((_) async {});
      });

      Future<void> pumpOverSettings(WidgetTester tester) async {
        await tester.pumpRouterApp(
          GoRouter(
            initialLocation: '/settings',
            routes: [
              GoRoute(path: '/', builder: (_, _) => const Text('Trang chủ')),
              GoRoute(
                path: '/settings',
                builder: (_, _) => const Text('Cài đặt'),
                routes: [
                  GoRoute(
                    path: 'delete',
                    builder: (_, _) => const DeleteAccountScreen(),
                  ),
                ],
              ),
            ],
          ),
          auth: auth,
          overrides: [ownedSellerNamesProvider.overrideWith((_) async => [])],
        );
        await tester.pumpAndSettle();
        final router = GoRouter.of(tester.element(find.text('Cài đặt')));
        unawaited(router.push<void>('/settings/delete'));
        await tester.pumpAndSettle();
      }

      testWidgets('the first step goes back without sending a code', (
        tester,
      ) async {
        await pumpOverSettings(tester);

        await tester.tapVisible(
          find.widgetWithText(OutlinedButton, 'Giữ tài khoản'),
        );
        await tester.pumpAndSettle();

        expect(find.text('Cài đặt'), findsOneWidget);
        verifyNever(auth.requestDeletionCode);
      });

      testWidgets('back after the deletion goes home, not to settings', (
        tester,
      ) async {
        when(auth.signOut).thenAnswer((_) async {});
        await pumpOverSettings(tester);

        await tester.tapVisible(find.text('Gửi mã xác nhận'));
        await tester.pumpAndSettle();
        await tester.enterText(find.byType(TextField), '123456');
        await tester.pump();
        await tester.tapVisible(
          find.widgetWithText(FilledButton, 'Xoá vĩnh viễn tài khoản'),
        );
        await tester.pumpAndSettle();
        expect(find.text('Đã xoá tài khoản'), findsOneWidget);

        await tester.tap(find.byType(BackButton));
        await tester.pumpAndSettle();

        expect(find.text('Trang chủ'), findsOneWidget);
        expect(find.text('Cài đặt'), findsNothing);
      });
    });

    testWidgets('warns the owner of a seller that it closes', (tester) async {
      await tester.pumpApp(
        const DeleteAccountScreen(),
        auth: signedInAs(sampleAccount),
        overrides: [
          ownedSellerNamesProvider.overrideWith((_) async => ['Bánh mì Tasco']),
        ],
      );
      await tester.pumpAndSettle();

      expect(find.text('Bạn đang là chủ quán'), findsOneWidget);
      expect(
        find.textContaining('Xoá tài khoản sẽ đóng Bánh mì Tasco'),
        findsOneWidget,
      );
    });
  });
}
