// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'audit_events_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuditEventsOutputBody _$AuditEventsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AuditEventsOutputBody(
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => AuditEventBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$AuditEventsOutputBodyToJson(
  _AuditEventsOutputBody instance,
) => <String, dynamic>{
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
