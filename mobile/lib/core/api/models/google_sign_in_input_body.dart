// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'google_sign_in_input_body_session.dart';

part 'google_sign_in_input_body.freezed.dart';
part 'google_sign_in_input_body.g.dart';

@Freezed()
abstract class GoogleSignInInputBody with _$GoogleSignInInputBody {
  const factory GoogleSignInInputBody({
    /// The ID token Google's sign-in handed the page or the application
    required String idToken,

    /// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
    @Default(GoogleSignInInputBodySession.token)
    GoogleSignInInputBodySession session,

    /// The value whose SHA-256 was given to Google as the nonce; required when the token carries one
    String? nonce,
  }) = _GoogleSignInInputBody;

  factory GoogleSignInInputBody.fromJson(Map<String, Object?> json) =>
      _$GoogleSignInInputBodyFromJson(json);
}
