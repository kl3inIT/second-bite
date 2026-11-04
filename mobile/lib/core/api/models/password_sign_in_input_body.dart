// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'password_sign_in_input_body_session.dart';

part 'password_sign_in_input_body.freezed.dart';
part 'password_sign_in_input_body.g.dart';

@Freezed()
abstract class PasswordSignInInputBody with _$PasswordSignInInputBody {
  const factory PasswordSignInInputBody({
    required String password,
    required String username,

    /// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
    @Default(PasswordSignInInputBodySession.token)
    PasswordSignInInputBodySession session,
  }) = _PasswordSignInInputBody;

  factory PasswordSignInInputBody.fromJson(Map<String, Object?> json) =>
      _$PasswordSignInInputBodyFromJson(json);
}
