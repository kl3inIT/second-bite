// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sign_in_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SignInInputBody _$SignInInputBodyFromJson(Map<String, dynamic> json) =>
    _SignInInputBody(
      challengeId: json['challengeId'] as String,
      code: json['code'] as String,
      session: json['session'] == null
          ? SignInInputBodySession.token
          : SignInInputBodySession.fromJson(json['session'] as String),
    );

Map<String, dynamic> _$SignInInputBodyToJson(_SignInInputBody instance) =>
    <String, dynamic>{
      'challengeId': instance.challengeId,
      'code': instance.code,
      'session': _$SignInInputBodySessionEnumMap[instance.session]!,
    };

const _$SignInInputBodySessionEnumMap = {
  SignInInputBodySession.token: 'token',
  SignInInputBodySession.cookie: 'cookie',
  SignInInputBodySession.$unknown: r'$unknown',
};
