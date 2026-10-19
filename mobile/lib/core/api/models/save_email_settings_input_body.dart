// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'save_email_settings_input_body_provider.dart';
import 'save_email_settings_input_body_smtp_security.dart';

part 'save_email_settings_input_body.freezed.dart';
part 'save_email_settings_input_body.g.dart';

@Freezed()
abstract class SaveEmailSettingsInputBody with _$SaveEmailSettingsInputBody {
  const factory SaveEmailSettingsInputBody({
    required SaveEmailSettingsInputBodyProvider provider,
    required String senderAddress,
    required String senderName,

    /// Empty keeps the stored key
    String? brevoApiKey,
    String? smtpHost,

    /// Empty keeps the stored password
    String? smtpPassword,
    int? smtpPort,
    SaveEmailSettingsInputBodySmtpSecurity? smtpSecurity,
    String? smtpUsername,
  }) = _SaveEmailSettingsInputBody;

  factory SaveEmailSettingsInputBody.fromJson(Map<String, Object?> json) =>
      _$SaveEmailSettingsInputBodyFromJson(json);
}
