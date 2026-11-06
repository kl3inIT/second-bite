// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_settings_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderSettingsBody _$OrderSettingsBodyFromJson(Map<String, dynamic> json) =>
    _OrderSettingsBody(
      missedDays: (json['missedDays'] as num).toInt(),
      missedLimit: (json['missedLimit'] as num).toInt(),
      openPerAddress: (json['openPerAddress'] as num).toInt(),
      openPerPhonePerSeller: (json['openPerPhonePerSeller'] as num).toInt(),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$OrderSettingsBodyToJson(_OrderSettingsBody instance) =>
    <String, dynamic>{
      'missedDays': instance.missedDays,
      'missedLimit': instance.missedLimit,
      'openPerAddress': instance.openPerAddress,
      'openPerPhonePerSeller': instance.openPerPhonePerSeller,
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'updatedBy': instance.updatedBy,
    };
