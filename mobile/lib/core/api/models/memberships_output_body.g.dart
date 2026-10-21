// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'memberships_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MembershipsOutputBody _$MembershipsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _MembershipsOutputBody(
  memberships: (json['memberships'] as List<dynamic>?)
      ?.map((e) => MembershipBody.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$MembershipsOutputBodyToJson(
  _MembershipsOutputBody instance,
) => <String, dynamic>{'memberships': instance.memberships};
