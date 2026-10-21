import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:second_bite/core/session.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:second_bite/features/identity/ui/current_account.dart';

import '../../../helpers/helpers.dart';

class _MockGoogleAuth extends Mock implements GoogleAuth;

class _MockStore extends Mock implements SessionStore;

void main() {
  group(CurrentAccount, () {
    late MockAuthRepository auth;
    late GoogleAuth google;
    late ProviderContainer container;

    setUp(() async {
      auth = MockAuthRepository();
      when(auth.currentAccount).thenAnswer((_) async => sampleAccount);
      google = _MockGoogleAuth();
      when(google.signOut).thenAnswer((_) async {});
      final store = _MockStore();
      when(() => store.cleared).thenAnswer((_) => const Stream.empty());
      container = ProviderContainer.test(
        overrides: [
          authRepositoryProvider.overrideWithValue(auth),
          googleAuthProvider.overrideWithValue(google),
          sessionStoreProvider.overrideWithValue(store),
        ],
      );
      expect(
        await container.read(currentAccountProvider.future),
        sampleAccount,
      );
    });

    test('a deletion signs out here and of Google', () async {
      when(() => auth.deleteAccount(challengeId: 'del-1', code: '123456'))
          .thenAnswer((_) async {});

      await container
          .read(currentAccountProvider.notifier)
          .deleteAccount(challengeId: 'del-1', code: '123456');

      expect(container.read(currentAccountProvider).value, isNull);
      verify(google.signOut).called(1);
    });

    test('a refused deletion keeps the account and Google', () async {
      when(() => auth.deleteAccount(challengeId: 'del-1', code: '111111'))
          .thenThrow(DioException(requestOptions: RequestOptions()));

      await expectLater(
        container
            .read(currentAccountProvider.notifier)
            .deleteAccount(challengeId: 'del-1', code: '111111'),
        throwsA(isA<DioException>()),
      );

      expect(container.read(currentAccountProvider).value, sampleAccount);
      verifyNever(google.signOut);
    });

    test('a deletion stands when Google fails to sign out', () async {
      when(() => auth.deleteAccount(challengeId: 'del-1', code: '123456'))
          .thenAnswer((_) async {});
      when(google.signOut).thenThrow(StateError('no Google here'));

      await container
          .read(currentAccountProvider.notifier)
          .deleteAccount(challengeId: 'del-1', code: '123456');

      expect(container.read(currentAccountProvider).value, isNull);
    });
  });
}
