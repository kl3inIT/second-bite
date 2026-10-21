import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/core/api.dart';
import 'package:second_bite/core/session.dart';

part 'auth_repository.g.dart';

/// {@template auth_repository}
/// Signing in and out over the generated client (SEC-29, SEC-43): the
/// emailed code or Google's ID token buys a session token, which is kept in
/// the [SessionStore] and sent by the [SessionInterceptor] from then on. A
/// failure is the client's `DioException`, whose problem names its `code`.
/// {@endtemplate}
class AuthRepository {
  /// {@macro auth_repository}
  const new(this._api, this._store);

  final SecondBiteApi _api;
  final SessionStore _store;

  /// Google's client ID when the server offers Google, else null.
  Future<String?> googleClientId() async =>
      (await _api.signIn.getSignInMethods()).google?.clientId;

  /// Emails a code to [email]; the challenge to confirm it against.
  Future<String> requestCode(String email) async {
    final answer = await _api.signIn.requestSignInCode(
      body: RequestCodeInputBody(email: email),
    );
    return answer.challengeId;
  }

  /// Confirms [code] for [challengeId], keeps the session and returns its
  /// account.
  Future<AccountBody> signIn({
    required String challengeId,
    required String code,
  }) async {
    final session = await _api.signIn.signIn(
      body: SignInInputBody(challengeId: challengeId, code: code),
    );
    return await _keep(session);
  }

  /// Signs in with Google's [idToken] and the [nonce] its SHA-256 was made
  /// from, keeps the session and returns its account.
  Future<AccountBody> signInWithGoogle({
    required String idToken,
    required String nonce,
  }) async {
    final session = await _api.signIn.signInWithGoogle(
      body: GoogleSignInInputBody(idToken: idToken, nonce: nonce),
    );
    return await _keep(session);
  }

  /// The signed-in account, or null when no session is kept or the server no
  /// longer knows it.
  Future<AccountBody?> currentAccount() async {
    if (await _store.read() == null) return null;
    try {
      return await _api.accounts.getMyAccount();
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        await _store.clear();
        return null;
      }
      rethrow;
    }
  }

  /// Ends the session on the server and forgets it here, whatever the
  /// server answers, as the web does.
  Future<void> signOut() async {
    try {
      await _api.signIn.signOut();
    } on DioException {
      // Signed out here all the same; an ended session needs no more.
    } finally {
      await _store.clear();
    }
  }

  /// Gives the signed-in account the display name it chose (SEC-61); the
  /// account as the server keeps it, the name trimmed.
  Future<AccountBody> setDisplayName(String name) => _api.accounts
      .setMyDisplayName(body: SetDisplayNameInputBody(displayName: name));

  /// Emails the signed-in account's address a code that only confirms its
  /// deletion (SEC-37); the challenge to confirm it against.
  Future<String> requestDeletionCode() async {
    final answer = await _api.accounts.requestAccountDeletionCode();
    return answer.challengeId;
  }

  /// Deletes the signed-in account with [code] for [challengeId]; the server
  /// ends every session, so the kept one is forgotten here.
  Future<void> deleteAccount({
    required String challengeId,
    required String code,
  }) async {
    await _api.accounts.deleteMyAccount(
      body: DeleteAccountInputBody(challengeId: challengeId, code: code),
    );
    await _store.clear();
  }

  Future<AccountBody> _keep(SessionOutputBody session) async {
    final token = session.token;
    if (token == null) {
      throw StateError('The server answered no session token');
    }
    await _store.write(token);
    return session.account;
  }
}

/// The [AuthRepository] over the app's one client and session store, kept
/// for the app's life as they are, since the signed-in account follows it.
@Riverpod(keepAlive: true)
AuthRepository authRepository(Ref ref) =>
    AuthRepository(ref.watch(apiProvider), ref.watch(sessionStoreProvider));
