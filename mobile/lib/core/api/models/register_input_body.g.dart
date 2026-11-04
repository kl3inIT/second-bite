// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RegisterInputBody _$RegisterInputBodyFromJson(Map<String, dynamic> json) =>
    _RegisterInputBody(
      password: json['password'] as String,
      username: json['username'] as String,
      session: json['session'] == null
          ? RegisterInputBodySession.token
          : RegisterInputBodySession.fromJson(json['session'] as String),
    );

Map<String, dynamic> _$RegisterInputBodyToJson(_RegisterInputBody instance) =>
    <String, dynamic>{
      'password': instance.password,
      'username': instance.username,
      'session': _$RegisterInputBodySessionEnumMap[instance.session]!,
    };

const _$RegisterInputBodySessionEnumMap = {
  RegisterInputBodySession.token: 'token',
  RegisterInputBodySession.cookie: 'cookie',
  RegisterInputBodySession.$unknown: r'$unknown',
};
