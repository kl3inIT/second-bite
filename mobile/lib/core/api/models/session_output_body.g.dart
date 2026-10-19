// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'session_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SessionOutputBody _$SessionOutputBodyFromJson(Map<String, dynamic> json) =>
    _SessionOutputBody(
      account: AccountBody.fromJson(json['account'] as Map<String, dynamic>),
      expiresAt: DateTime.parse(json['expiresAt'] as String),
      token: json['token'] as String?,
    );

Map<String, dynamic> _$SessionOutputBodyToJson(_SessionOutputBody instance) =>
    <String, dynamic>{
      'account': instance.account,
      'expiresAt': instance.expiresAt.toIso8601String(),
      'token': instance.token,
    };
