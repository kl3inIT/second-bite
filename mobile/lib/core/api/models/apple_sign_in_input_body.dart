// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'apple_sign_in_input_body_session.dart';

part 'apple_sign_in_input_body.freezed.dart';
part 'apple_sign_in_input_body.g.dart';

@Freezed()
abstract class AppleSignInInputBody with _$AppleSignInInputBody {
  const factory AppleSignInInputBody({
    /// The authorization code Apple's sheet handed the application, exchanged once for the token that revokes the access
    required String authorizationCode,

    /// The identity token Apple's sheet handed the application
    required String idToken,

    /// The value whose SHA-256 was given to Apple as the nonce
    required String nonce,

    /// token: the token in the body (the mobile application); cookie: the session cookie instead
    @Default(AppleSignInInputBodySession.token)
    AppleSignInInputBodySession session,

    /// The family name Apple shares on the first authorization only
    String? familyName,

    /// The given name Apple shares on the first authorization only
    String? givenName,
  }) = _AppleSignInInputBody;

  factory AppleSignInInputBody.fromJson(Map<String, Object?> json) =>
      _$AppleSignInInputBodyFromJson(json);
}
