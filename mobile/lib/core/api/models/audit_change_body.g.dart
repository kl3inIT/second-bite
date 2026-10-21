// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_change_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditChangeBody _$AuditChangeBodyFromJson(Map<String, dynamic> json) =>
    _AuditChangeBody(
      field: json['field'] as String,
      from: json['from'] as String?,
      to: json['to'] as String?,
    );

Map<String, dynamic> _$AuditChangeBodyToJson(_AuditChangeBody instance) =>
    <String, dynamic>{
      'field': instance.field,
      'from': instance.from,
      'to': instance.to,
    };
