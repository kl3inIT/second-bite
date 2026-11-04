// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'register_input_body_session.dart';

part 'register_input_body.freezed.dart';
part 'register_input_body.g.dart';

@Freezed()
abstract class RegisterInputBody with _$RegisterInputBody {
  const factory RegisterInputBody({
    /// 8 to 128 characters, not the username
    required String password,

    /// 3 to 30 characters: letters without marks, digits, dots, underscores and hyphens, the first and the last a letter or a digit; kept in lower case
    required String username,

    /// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
    @Default(RegisterInputBodySession.token) RegisterInputBodySession session,
  }) = _RegisterInputBody;

  factory RegisterInputBody.fromJson(Map<String, Object?> json) =>
      _$RegisterInputBodyFromJson(json);
}
