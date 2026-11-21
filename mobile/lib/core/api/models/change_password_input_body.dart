// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'change_password_input_body.freezed.dart';
part 'change_password_input_body.g.dart';

@Freezed()
abstract class ChangePasswordInputBody with _$ChangePasswordInputBody {
  const factory ChangePasswordInputBody({
    /// The password the account has now, which confirms the change
    required String currentPassword,

    /// 8 to 128 characters, not the username
    required String newPassword,
  }) = _ChangePasswordInputBody;

  factory ChangePasswordInputBody.fromJson(Map<String, Object?> json) =>
      _$ChangePasswordInputBodyFromJson(json);
}
