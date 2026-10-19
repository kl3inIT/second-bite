// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_settings_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_EmailSettingsBody _$EmailSettingsBodyFromJson(Map<String, dynamic> json) =>
    _EmailSettingsBody(
      brevoApiKeySet: json['brevoApiKeySet'] as bool,
      provider: EmailSettingsBodyProvider.fromJson(json['provider'] as String),
      senderAddress: json['senderAddress'] as String,
      senderName: json['senderName'] as String,
      smtpHost: json['smtpHost'] as String,
      smtpPasswordSet: json['smtpPasswordSet'] as bool,
      smtpPort: (json['smtpPort'] as num).toInt(),
      smtpSecurity: EmailSettingsBodySmtpSecurity.fromJson(
        json['smtpSecurity'] as String,
      ),
      smtpUsername: json['smtpUsername'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$EmailSettingsBodyToJson(_EmailSettingsBody instance) =>
    <String, dynamic>{
      'brevoApiKeySet': instance.brevoApiKeySet,
      'provider': _$EmailSettingsBodyProviderEnumMap[instance.provider]!,
      'senderAddress': instance.senderAddress,
      'senderName': instance.senderName,
      'smtpHost': instance.smtpHost,
      'smtpPasswordSet': instance.smtpPasswordSet,
      'smtpPort': instance.smtpPort,
      'smtpSecurity':
          _$EmailSettingsBodySmtpSecurityEnumMap[instance.smtpSecurity]!,
      'smtpUsername': instance.smtpUsername,
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$EmailSettingsBodyProviderEnumMap = {
  EmailSettingsBodyProvider.smtp: 'smtp',
  EmailSettingsBodyProvider.brevo: 'brevo',
  EmailSettingsBodyProvider.$unknown: r'$unknown',
};

const _$EmailSettingsBodySmtpSecurityEnumMap = {
  EmailSettingsBodySmtpSecurity.starttls: 'starttls',
  EmailSettingsBodySmtpSecurity.tls: 'tls',
  EmailSettingsBodySmtpSecurity.none: 'none',
  EmailSettingsBodySmtpSecurity.$unknown: r'$unknown',
};
