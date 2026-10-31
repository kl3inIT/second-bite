// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'status_day_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_StatusDayBody _$StatusDayBodyFromJson(Map<String, dynamic> json) =>
    _StatusDayBody(
      active: (json['active'] as num).toInt(),
      blocked: (json['blocked'] as num).toInt(),
      day: DateTime.parse(json['day'] as String),
      deleted: (json['deleted'] as num).toInt(),
      pending: (json['pending'] as num).toInt(),
      rejected: (json['rejected'] as num).toInt(),
    );

Map<String, dynamic> _$StatusDayBodyToJson(_StatusDayBody instance) =>
    <String, dynamic>{
      'active': instance.active,
      'blocked': instance.blocked,
      'day': instance.day.toIso8601String(),
      'deleted': instance.deleted,
      'pending': instance.pending,
      'rejected': instance.rejected,
    };
