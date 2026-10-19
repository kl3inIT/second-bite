import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/session.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';

import '../../../helpers/helpers.dart';

class _MockApi extends Mock implements SecondBiteApi;

class _MockSignIn extends Mock implements SignInClient;

class _MockAccounts extends Mock implements AccountsClient;

class _MockStore extends Mock implements SessionStore;

DioException _status(int status) {
  final options = RequestOptions(path: '/');
  return DioException(
    requestOptions: options,
    response: Response(requestOptions: options, statusCode: status),
  );
}

void main() {
  group(AuthRepository, () {
    late SignInClient signIn;
    late AccountsClient accounts;
    late SessionStore store;
    late AuthRepository repository;

    final session = SessionOutputBody(
      account: sampleAccount,
      expiresAt: DateTime.utc(2026, 11, 18),
      token: 'tok',
    );

    setUpAll(() {
      registerFallbackValue(const SignInInputBody(challengeId: '', code: ''));
      registerFallbackValue(const GoogleSignInInputBody(idToken: ''));
      registerFallbackValue(const RequestCodeInputBody(email: ''));
    });

    setUp(() {
      signIn = _MockSignIn();
      accounts = _MockAccounts();
      store = _MockStore();
      final api = _MockApi();
      when(() => api.signIn).thenReturn(signIn);
      when(() => api.accounts).thenReturn(accounts);
      when(() => store.write(any())).thenAnswer((_) async {});
      when(store.clear).thenAnswer((_) async {});
      repository = AuthRepository(api, store);
    });

    test('asks for a code and returns its challenge', () async {
      when(() => signIn.requestSignInCode(body: any(named: 'body'))).thenAnswer(
        (_) async => RequestCodeOutputBody(
          challengeId: 'ch-1',
          expiresAt: DateTime.utc(2026),
        ),
      );

      expect(await repository.requestCode('lan@gmail.com'), 'ch-1');
      verify(
        () => signIn.requestSignInCode(
          body: const RequestCodeInputBody(email: 'lan@gmail.com'),
        ),
      ).called(1);
    });

    test(
      'signs in with the code, asking for the token, and keeps it',
      () async {
        when(() => signIn.signIn(body: any(named: 'body')))
            .thenAnswer((_) async => session);

        final account = await repository.signIn(
          challengeId: 'ch-1',
          code: '123456',
        );

        expect(account, sampleAccount);
        final body =
            verify(() => signIn.signIn(body: captureAny(named: 'body')))
                    .captured
                    .single
                as SignInInputBody;
        expect(body.session, SignInInputBodySession.token);
        verify(() => store.write('tok')).called(1);
      },
    );

    test(
      'signs in with Google, posting the nonce, and keeps the token',
      () async {
        when(() => signIn.signInWithGoogle(body: any(named: 'body')))
            .thenAnswer((_) async => session);

        await repository.signInWithGoogle(idToken: 'id', nonce: 'n-1');

        verify(
          () => signIn.signInWithGoogle(
            body: const GoogleSignInInputBody(idToken: 'id', nonce: 'n-1'),
          ),
        ).called(1);
        verify(() => store.write('tok')).called(1);
      },
    );

    test('reads no account without a session', () async {
      when(store.read).thenAnswer((_) async => null);

      expect(await repository.currentAccount(), isNull);
      verifyNever(accounts.getMyAccount);
    });

    test('reads the account of the kept session', () async {
      when(store.read).thenAnswer((_) async => 'tok');
      when(accounts.getMyAccount).thenAnswer((_) async => sampleAccount);

      expect(await repository.currentAccount(), sampleAccount);
    });

    test('forgets a session the server no longer knows', () async {
      when(store.read).thenAnswer((_) async => 'tok');
      when(accounts.getMyAccount).thenThrow(_status(401));

      expect(await repository.currentAccount(), isNull);
      verify(store.clear).called(1);
    });

    test('signs out here even when the server fails', () async {
      when(signIn.signOut).thenThrow(_status(500));

      await repository.signOut();

      verify(store.clear).called(1);
    });

    test("names Google's client when the server offers it", () async {
      when(signIn.getSignInMethods).thenAnswer(
        (_) async => const MethodsOutputBody(
          google: GoogleMethodBody(clientId: 'web-client'),
        ),
      );

      expect(await repository.googleClientId(), 'web-client');
    });
  });
}
