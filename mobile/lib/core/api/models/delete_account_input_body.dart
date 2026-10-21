// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'delete_account_input_body.freezed.dart';
part 'delete_account_input_body.g.dart';

@Freezed()
abstract class DeleteAccountInputBody with _$DeleteAccountInputBody {
  const factory DeleteAccountInputBody({
    required String challengeId,

    /// The six digits of the deletion email
    required String code,
  }) = _DeleteAccountInputBody;

  factory DeleteAccountInputBody.fromJson(Map<String, Object?> json) =>
      _$DeleteAccountInputBodyFromJson(json);
}
