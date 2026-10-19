import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'google_auth.g.dart';

/// The iOS OAuth client, given at build time with
/// `--dart-define=GOOGLE_IOS_CLIENT_ID=…` (mobile/README.md › Signing in
/// with Google). Without it Google is not offered on iOS, since Google's iOS
/// SDK stops the app when it is asked to sign in without a client.
const _builtIosClientId = String.fromEnvironment('GOOGLE_IOS_CLIENT_ID');

/// What Google hands back: its ID token, and the value whose SHA-256 the
/// token carries as its nonce (SEC-29 › decision 6).
typedef GoogleCredential = ({String idToken, String nonce});

/// {@template google_auth}
/// Signing in with Google through the Flutter team's `google_sign_in`: on
/// Android through Credential Manager, on iOS through Google's SDK. The
/// server's client ID from `GET /auth/methods` is the `serverClientId`, so
/// the ID token is issued to the client the server already accepts.
/// {@endtemplate}
class GoogleAuth {
  /// {@macro google_auth}
  new({
    GoogleSignIn? signIn,
    TargetPlatform? platform,
    this._isWeb = kIsWeb,
    this._iosClientId = _builtIosClientId,
  }) : _signIn = signIn ?? GoogleSignIn.instance,
       _platform = platform ?? defaultTargetPlatform;

  final GoogleSignIn _signIn;
  final TargetPlatform _platform;
  final bool _isWeb;
  final String _iosClientId;

  Future<void>? _ready;
  String? _nonce;

  /// Whether this build can sign in with Google. In a browser Google allows
  /// only its own rendered button, which the preview does not show.
  bool get available =>
      !_isWeb &&
      switch (_platform) {
        TargetPlatform.android => true,
        TargetPlatform.iOS => _iosClientId.isNotEmpty,
        _ => false,
      };

  /// Asks Google for the person's ID token, for [serverClientId]; null when
  /// they closed Google's sheet. Any other failure is Google's
  /// [GoogleSignInException].
  Future<GoogleCredential?> signIn(String serverClientId) async {
    // `initialize` takes the nonce and may run once in the app's life, so
    // one nonce serves every Google sign-in of a launch.
    final nonce = _nonce ??= randomNonce();
    try {
      await (_ready ??= _signIn.initialize(
        clientId: _platform == TargetPlatform.iOS ? _iosClientId : null,
        serverClientId: serverClientId,
        nonce: sha256Hex(nonce),
      ));
    } on Object {
      _ready = null;
      rethrow;
    }
    try {
      final account = await _signIn.authenticate();
      final idToken = account.authentication.idToken;
      if (idToken == null) {
        throw const GoogleSignInException(
          code: GoogleSignInExceptionCode.unknownError,
          description: 'Google gave no ID token',
        );
      }
      return (idToken: idToken, nonce: nonce);
    } on GoogleSignInException catch (error) {
      if (error.code == GoogleSignInExceptionCode.canceled) return null;
      rethrow;
    }
  }

  /// Forgets the Google account on this phone, so the next sign-in asks
  /// which account again instead of choosing the last one.
  Future<void> signOut() async {
    final ready = _ready;
    if (ready == null) return;
    await ready;
    await _signIn.signOut();
  }
}

/// The app's one [GoogleAuth].
@Riverpod(keepAlive: true)
GoogleAuth googleAuth(Ref ref) => GoogleAuth();

/// 32 random bytes as hex, as the web draws its nonce.
String randomNonce() {
  final random = Random.secure();
  return [
    for (var i = 0; i < 32; i++)
      random.nextInt(256).toRadixString(16).padLeft(2, '0'),
  ].join();
}

/// The SHA-256 of [value] as hex, which Google puts in the token's `nonce`.
String sha256Hex(String value) => sha256.convert(utf8.encode(value)).toString();

/// The address in a Google ID token, read without checking it, only to name
/// it to the person, as the web's `emailInToken`.
String? emailInToken(String idToken) {
  final parts = idToken.split('.');
  if (parts.length < 2) return null;
  try {
    final claims = jsonDecode(
      utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
    );
    return claims is Map && claims['email'] is String
        ? claims['email'] as String
        : null;
  } on FormatException {
    return null;
  }
}
