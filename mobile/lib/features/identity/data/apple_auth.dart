import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:second_bite/features/identity/data/google_auth.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

part 'apple_auth.g.dart';

/// What Apple hands back (SEC-38): its identity token, the value whose
/// SHA-256 the token carries as its nonce, the authorization code the server
/// exchanges once, and the name Apple shares on the first authorization only.
typedef AppleCredential = ({
  String idToken,
  String nonce,
  String authorizationCode,
  String givenName,
  String familyName,
});

/// Asks Apple for a credential, as `SignInWithApple.getAppleIDCredential`.
typedef AppleRequest = Future<AuthorizationCredentialAppleID> Function({
  required List<AppleIDAuthorizationScopes> scopes,
  String? nonce,
});

/// {@template apple_auth}
/// Signing in with Apple through `sign_in_with_apple` (a Flutter Favorite):
/// Apple's own sheet on iOS. Android and the browser preview do not offer
/// it: there it needs a Services ID and a web flow (SEC-38 › Boundary).
/// {@endtemplate}
class AppleAuth {
  /// {@macro apple_auth}
  new({TargetPlatform? platform, this._isWeb = kIsWeb, AppleRequest? request})
    : _platform = platform ?? defaultTargetPlatform,
      _request = request ?? SignInWithApple.getAppleIDCredential;

  final TargetPlatform _platform;
  final bool _isWeb;
  final AppleRequest _request;

  /// Whether this build can sign in with Apple: the iOS app only.
  bool get available => !_isWeb && _platform == TargetPlatform.iOS;

  /// Asks Apple for the person's credential, with their name and address;
  /// null when they closed Apple's sheet. Any other failure is Apple's
  /// [SignInWithAppleException].
  Future<AppleCredential?> signIn() async {
    final nonce = randomNonce();
    try {
      final credential = await _request(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
        nonce: sha256Hex(nonce),
      );
      final idToken = credential.identityToken;
      if (idToken == null) {
        throw const SignInWithAppleAuthorizationException(
          code: AuthorizationErrorCode.invalidResponse,
          message: 'Apple gave no identity token',
        );
      }
      return (
        idToken: idToken,
        nonce: nonce,
        authorizationCode: credential.authorizationCode,
        givenName: credential.givenName ?? '',
        familyName: credential.familyName ?? '',
      );
    } on SignInWithAppleAuthorizationException catch (error) {
      if (error.code == AuthorizationErrorCode.canceled) return null;
      rethrow;
    }
  }
}

/// The app's one [AppleAuth].
@Riverpod(keepAlive: true)
AppleAuth appleAuth(Ref ref) => AppleAuth();
