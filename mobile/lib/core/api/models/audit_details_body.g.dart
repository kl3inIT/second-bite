// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditDetailsBody _$AuditDetailsBodyFromJson(
  Map<String, dynamic> json,
) => _AuditDetailsBody(
  amountVnd: (json['amountVnd'] as num?)?.toInt(),
  changes: (json['changes'] as List<dynamic>?)
      ?.map((e) => AuditChangeBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  name: json['name'] as String?,
  orders: (json['orders'] as num?)?.toInt(),
  provider: json['provider'] == null
      ? null
      : AuditDetailsBodyProvider.fromJson(json['provider'] as String),
  reason: json['reason'] as String?,
  sellerId: json['sellerId'] as String?,
  since: json['since'] == null ? null : DateTime.parse(json['since'] as String),
  source: json['source'] == null
      ? null
      : AuditDetailsBodySource.fromJson(json['source'] as String),
  until: json['until'] == null ? null : DateTime.parse(json['until'] as String),
  weekStart: json['weekStart'] as String?,
);

Map<String, dynamic> _$AuditDetailsBodyToJson(_AuditDetailsBody instance) =>
    <String, dynamic>{
      'amountVnd': instance.amountVnd,
      'changes': instance.changes,
      'name': instance.name,
      'orders': instance.orders,
      'provider': _$AuditDetailsBodyProviderEnumMap[instance.provider],
      'reason': instance.reason,
      'sellerId': instance.sellerId,
      'since': instance.since?.toIso8601String(),
      'source': _$AuditDetailsBodySourceEnumMap[instance.source],
      'until': instance.until?.toIso8601String(),
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
