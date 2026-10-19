// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'save_email_settings_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SaveEmailSettingsInputBody _$SaveEmailSettingsInputBodyFromJson(
  Map<String, dynamic> json,
) => _SaveEmailSettingsInputBody(
  provider: SaveEmailSettingsInputBodyProvider.fromJson(
    json['provider'] as String,
  ),
  senderAddress: json['senderAddress'] as String,
  senderName: json['senderName'] as String,
  brevoApiKey: json['brevoApiKey'] as String?,
  smtpHost: json['smtpHost'] as String?,
  smtpPassword: json['smtpPassword'] as String?,
  smtpPort: (json['smtpPort'] as num?)?.toInt(),
  smtpSecurity: json['smtpSecurity'] == null
      ? null
      : SaveEmailSettingsInputBodySmtpSecurity.fromJson(
          json['smtpSecurity'] as String,
        ),
  smtpUsername: json['smtpUsername'] as String?,
);

Map<String, dynamic> _$SaveEmailSettingsInputBodyToJson(
  _SaveEmailSettingsInputBody instance,
) => <String, dynamic>{
  'provider': _$SaveEmailSettingsInputBodyProviderEnumMap[instance.provider]!,
  'senderAddress': instance.senderAddress,
  'senderName': instance.senderName,
  'brevoApiKey': instance.brevoApiKey,
  'smtpHost': instance.smtpHost,
  'smtpPassword': instance.smtpPassword,
  'smtpPort': instance.smtpPort,
  'smtpSecurity':
      _$SaveEmailSettingsInputBodySmtpSecurityEnumMap[instance.smtpSecurity],
  'smtpUsername': instance.smtpUsername,
};

const _$SaveEmailSettingsInputBodyProviderEnumMap = {
  SaveEmailSettingsInputBodyProvider.smtp: 'smtp',
  SaveEmailSettingsInputBodyProvider.brevo: 'brevo',
  SaveEmailSettingsInputBodyProvider.$unknown: r'$unknown',
};

const _$SaveEmailSettingsInputBodySmtpSecurityEnumMap = {
  SaveEmailSettingsInputBodySmtpSecurity.starttls: 'starttls',
  SaveEmailSettingsInputBodySmtpSecurity.tls: 'tls',
  SaveEmailSettingsInputBodySmtpSecurity.none: 'none',
  SaveEmailSettingsInputBodySmtpSecurity.$unknown: r'$unknown',
};
