// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AccountBody _$AccountBodyFromJson(Map<String, dynamic> json) => _AccountBody(
  displayName: json['displayName'] as String,
  email: json['email'] as String,
  id: json['id'] as String,
  role: AccountBodyRole.fromJson(json['role'] as String),
);

Map<String, dynamic> _$AccountBodyToJson(_AccountBody instance) =>
    <String, dynamic>{
      'displayName': instance.displayName,
      'email': instance.email,
      'id': instance.id,
      'role': _$AccountBodyRoleEnumMap[instance.role]!,
    };

const _$AccountBodyRoleEnumMap = {
  AccountBodyRole.customer: 'customer',
  AccountBodyRole.admin: 'admin',
  AccountBodyRole.$unknown: r'$unknown',
};
