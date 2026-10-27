// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_members_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminMembersOutputBody _$AdminMembersOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminMembersOutputBody(
  members: (json['members'] as List<dynamic>?)
      ?.map((e) => MemberBody.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$AdminMembersOutputBodyToJson(
  _AdminMembersOutputBody instance,
) => <String, dynamic>{'members': instance.members};
