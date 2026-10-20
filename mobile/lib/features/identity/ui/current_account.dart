import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/session.dart';
import 'package:second_bite/features/identity/data/auth_repository.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';

part 'current_account.g.dart';

// A failure shows at once, as on the home, rather than behind retries.
Duration? _never(int retryCount, Object error) => null;

/// {@template current_account}
/// Who is signed in, for every screen: null for no one. It reads the kept
/// session when the app starts, follows sign-in and sign-out, and turns to
/// null when the server refuses the token.
/// {@endtemplate}
@Riverpod(keepAlive: true, retry: _never)
class CurrentAccount extends _$CurrentAccount {
  @override
  Future<AccountBody?> build() {
    final cleared = ref
        .watch(sessionStoreProvider)
        .cleared
        .listen((_) => state = const AsyncData(null));
    ref.onDispose(cleared.cancel);
    return ref.watch(authRepositoryProvider).currentAccount();
  }

  /// Records [account], just signed in.
  void signedIn(AccountBody account) => state = AsyncData(account);

  /// Deletes the account with the emailed [code] (SEC-37): no one is signed
  /// in after, and the Google account chosen on this phone is forgotten.
  Future<void> deleteAccount({
    required String challengeId,
    required String code,
  }) async {
    await ref
        .read(authRepositoryProvider)
        .deleteAccount(challengeId: challengeId, code: code);
    state = const AsyncData(null);
    try {
      await ref.read(googleAuthProvider).signOut();
    } on Object {
      // Google's own state matters only to the next Google sign-in.
    }
  }

  /// Ends the session here and on the server, and forgets the Google account
  /// chosen on this phone.
  Future<void> signOut() async {
    try {
      await ref.read(authRepositoryProvider).signOut();
    } finally {
      state = const AsyncData(null);
    }
    try {
      await ref.read(googleAuthProvider).signOut();
    } on Object {
      // Google's own state matters only to the next Google sign-in.
    }
  }
}
