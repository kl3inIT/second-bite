// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'request_code_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RequestCodeOutputBody _$RequestCodeOutputBodyFromJson(
  Map<String, dynamic> json,
) => _RequestCodeOutputBody(
  challengeId: json['challengeId'] as String,
  expiresAt: DateTime.parse(json['expiresAt'] as String),
);

Map<String, dynamic> _$RequestCodeOutputBodyToJson(
  _RequestCodeOutputBody instance,
) => <String, dynamic>{
  'challengeId': instance.challengeId,
  'expiresAt': instance.expiresAt.toIso8601String(),
};
