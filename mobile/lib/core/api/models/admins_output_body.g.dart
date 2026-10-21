// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admins_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminsOutputBody _$AdminsOutputBodyFromJson(Map<String, dynamic> json) =>
    _AdminsOutputBody(
      admins: (json['admins'] as List<dynamic>?)
          ?.map((e) => AccountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$AdminsOutputBodyToJson(_AdminsOutputBody instance) =>
    <String, dynamic>{'admins': instance.admins};
