// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'methods_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MethodsOutputBody _$MethodsOutputBodyFromJson(Map<String, dynamic> json) =>
    _MethodsOutputBody(
      apple: json['apple'],
      google: json['google'] == null
          ? null
          : GoogleMethodBody.fromJson(json['google'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$MethodsOutputBodyToJson(_MethodsOutputBody instance) =>
    <String, dynamic>{'apple': instance.apple, 'google': instance.google};
