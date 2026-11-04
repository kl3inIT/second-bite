// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'delete_account_with_password_input_body.freezed.dart';
part 'delete_account_with_password_input_body.g.dart';

@Freezed()
abstract class DeleteAccountWithPasswordInputBody
    with _$DeleteAccountWithPasswordInputBody {
  const factory DeleteAccountWithPasswordInputBody({
    /// The account's password, which confirms the deletion
    required String password,
  }) = _DeleteAccountWithPasswordInputBody;

  factory DeleteAccountWithPasswordInputBody.fromJson(
    Map<String, Object?> json,
  ) => _$DeleteAccountWithPasswordInputBodyFromJson(json);
}
