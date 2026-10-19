// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MemberBody _$MemberBodyFromJson(Map<String, dynamic> json) => _MemberBody(
  accountId: json['accountId'] as String,
  addedAt: DateTime.parse(json['addedAt'] as String),
  email: json['email'] as String,
  role: MemberBodyRole.fromJson(json['role'] as String),
);

Map<String, dynamic> _$MemberBodyToJson(_MemberBody instance) =>
    <String, dynamic>{
      'accountId': instance.accountId,
      'addedAt': instance.addedAt.toIso8601String(),
      'email': instance.email,
      'role': _$MemberBodyRoleEnumMap[instance.role]!,
    };

const _$MemberBodyRoleEnumMap = {
  MemberBodyRole.owner: 'owner',
  MemberBodyRole.staff: 'staff',
  MemberBodyRole.$unknown: r'$unknown',
};
