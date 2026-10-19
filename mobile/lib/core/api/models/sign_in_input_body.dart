// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'sign_in_input_body_session.dart';

part 'sign_in_input_body.freezed.dart';
part 'sign_in_input_body.g.dart';

@Freezed()
abstract class SignInInputBody with _$SignInInputBody {
  const factory SignInInputBody({
    required String challengeId,

    /// The six digits of the email
    required String code,

    /// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
    @Default(SignInInputBodySession.token) SignInInputBodySession session,
  }) = _SignInInputBody;

  factory SignInInputBody.fromJson(Map<String, Object?> json) =>
      _$SignInInputBodyFromJson(json);
}
