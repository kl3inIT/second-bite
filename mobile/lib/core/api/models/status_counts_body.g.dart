// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'status_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_StatusCountsBody _$StatusCountsBodyFromJson(Map<String, dynamic> json) =>
    _StatusCountsBody(
      active: (json['active'] as num).toInt(),
      blocked: (json['blocked'] as num).toInt(),
      deleted: (json['deleted'] as num).toInt(),
      pending: (json['pending'] as num).toInt(),
      rejected: (json['rejected'] as num).toInt(),
    );

Map<String, dynamic> _$StatusCountsBodyToJson(_StatusCountsBody instance) =>
    <String, dynamic>{
      'active': instance.active,
      'blocked': instance.blocked,
      'deleted': instance.deleted,
      'pending': instance.pending,
      'rejected': instance.rejected,
    };
