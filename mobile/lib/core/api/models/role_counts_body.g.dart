// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'role_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RoleCountsBody _$RoleCountsBodyFromJson(Map<String, dynamic> json) =>
    _RoleCountsBody(
      admin: (json['admin'] as num).toInt(),
      customer: (json['customer'] as num).toInt(),
    );

Map<String, dynamic> _$RoleCountsBodyToJson(_RoleCountsBody instance) =>
    <String, dynamic>{'admin': instance.admin, 'customer': instance.customer};
