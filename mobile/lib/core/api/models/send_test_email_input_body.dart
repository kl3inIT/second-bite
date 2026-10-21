// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'send_test_email_input_body.freezed.dart';
part 'send_test_email_input_body.g.dart';

@Freezed()
abstract class SendTestEmailInputBody with _$SendTestEmailInputBody {
  const factory SendTestEmailInputBody({
    /// Who receives it; the admin sending it when empty
    String? to,
  }) = _SendTestEmailInputBody;

  factory SendTestEmailInputBody.fromJson(Map<String, Object?> json) =>
      _$SendTestEmailInputBodyFromJson(json);
}
