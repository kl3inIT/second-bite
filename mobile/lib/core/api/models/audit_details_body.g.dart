// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditDetailsBody _$AuditDetailsBodyFromJson(Map<String, dynamic> json) =>
    _AuditDetailsBody(
      changes: (json['changes'] as List<dynamic>?)
          ?.map((e) => AuditChangeBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      provider: json['provider'] == null
          ? null
          : AuditDetailsBodyProvider.fromJson(json['provider'] as String),
      reason: json['reason'] as String?,
      source: json['source'] == null
          ? null
          : AuditDetailsBodySource.fromJson(json['source'] as String),
    );

Map<String, dynamic> _$AuditDetailsBodyToJson(_AuditDetailsBody instance) =>
    <String, dynamic>{
      'changes': instance.changes,
      'provider': _$AuditDetailsBodyProviderEnumMap[instance.provider],
      'reason': instance.reason,
      'source': _$AuditDetailsBodySourceEnumMap[instance.source],
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
