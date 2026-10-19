// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'violation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_Violation _$ViolationFromJson(Map<String, dynamic> json) => _Violation(
  code: json['code'] as String,
  detail: json['detail'] as String,
  parameter: json['parameter'] as String?,
  pointer: json['pointer'] as String?,
);

Map<String, dynamic> _$ViolationToJson(_Violation instance) =>
    <String, dynamic>{
      'code': instance.code,
      'detail': instance.detail,
      'parameter': instance.parameter,
      'pointer': instance.pointer,
    };
