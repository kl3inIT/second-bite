// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditDetailsBody _$AuditDetailsBodyFromJson(Map<String, dynamic> json) =>
    _AuditDetailsBody(
      amountVnd: (json['amountVnd'] as num?)?.toInt(),
      changes: (json['changes'] as List<dynamic>?)
          ?.map((e) => AuditChangeBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      name: json['name'] as String?,
      provider: json['provider'] == null
          ? null
          : AuditDetailsBodyProvider.fromJson(json['provider'] as String),
      reason: json['reason'] as String?,
      source: json['source'] == null
          ? null
          : AuditDetailsBodySource.fromJson(json['source'] as String),
      weekStart: json['weekStart'] as String?,
    );

Map<String, dynamic> _$AuditDetailsBodyToJson(_AuditDetailsBody instance) =>
    <String, dynamic>{
      'amountVnd': instance.amountVnd,
      'changes': instance.changes,
      'name': instance.name,
      'provider': _$AuditDetailsBodyProviderEnumMap[instance.provider],
      'reason': instance.reason,
      'source': _$AuditDetailsBodySourceEnumMap[instance.source],
      'weekStart': instance.weekStart,
    };

const _$AuditDetailsBodyProviderEnumMap = {
  AuditDetailsBodyProvider.smtp: 'smtp',
  AuditDetailsBodyProvider.brevo: 'brevo',
  AuditDetailsBodyProvider.$unknown: r'$unknown',
};

const _$AuditDetailsBodySourceEnumMap = {
  AuditDetailsBodySource.admin: 'admin',
  AuditDetailsBodySource.commandLine: 'command_line',
  AuditDetailsBodySource.$unknown: r'$unknown',
};
