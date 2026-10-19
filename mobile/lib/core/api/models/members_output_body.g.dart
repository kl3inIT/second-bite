// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'members_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MembersOutputBody _$MembersOutputBodyFromJson(Map<String, dynamic> json) =>
    _MembersOutputBody(
      members: (json['members'] as List<dynamic>?)
          ?.map((e) => MemberBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$MembersOutputBodyToJson(_MembersOutputBody instance) =>
    <String, dynamic>{'members': instance.members};
