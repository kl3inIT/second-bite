// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'email_settings_body_provider.dart';
import 'email_settings_body_smtp_security.dart';

part 'email_settings_body.freezed.dart';
part 'email_settings_body.g.dart';

@Freezed()
abstract class EmailSettingsBody with _$EmailSettingsBody {
  const factory EmailSettingsBody({
    /// Whether a Brevo API key is stored; it is never returned
    required bool brevoApiKeySet,
    required EmailSettingsBodyProvider provider,
    required String senderAddress,
    required String senderName,
    required String smtpHost,

    /// Whether an SMTP password is stored; it is never returned
    required bool smtpPasswordSet,
    required int smtpPort,
    required EmailSettingsBodySmtpSecurity smtpSecurity,
    required String smtpUsername,
    required DateTime updatedAt,
  }) = _EmailSettingsBody;

  factory EmailSettingsBody.fromJson(Map<String, Object?> json) =>
      _$EmailSettingsBodyFromJson(json);
}
