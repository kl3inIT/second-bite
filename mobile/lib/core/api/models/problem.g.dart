// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'problem.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Problem _$ProblemFromJson(Map<String, dynamic> json) => _Problem(
  code: json['code'] as String,
  status: (json['status'] as num).toInt(),
  title: json['title'] as String,
  type: json['type'] as String,
  detail: json['detail'] as String?,
  errors: (json['errors'] as List<dynamic>?)
      ?.map((e) => Violation.fromJson(e as Map<String, dynamic>))
      .toList(),
  requestId: json['requestId'] as String?,
);

Map<String, dynamic> _$ProblemToJson(_Problem instance) => <String, dynamic>{
  'code': instance.code,
  'status': instance.status,
  'title': instance.title,
  'type': instance.type,
  'detail': instance.detail,
  'errors': instance.errors,
  'requestId': instance.requestId,
};
