// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'password_sign_in_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PasswordSignInInputBody _$PasswordSignInInputBodyFromJson(
  Map<String, dynamic> json,
) => _PasswordSignInInputBody(
  password: json['password'] as String,
  username: json['username'] as String,
  session: json['session'] == null
      ? PasswordSignInInputBodySession.token
      : PasswordSignInInputBodySession.fromJson(json['session'] as String),
);

Map<String, dynamic> _$PasswordSignInInputBodyToJson(
  _PasswordSignInInputBody instance,
) => <String, dynamic>{
  'password': instance.password,
  'username': instance.username,
  'session': _$PasswordSignInInputBodySessionEnumMap[instance.session]!,
};

const _$PasswordSignInInputBodySessionEnumMap = {
  PasswordSignInInputBodySession.token: 'token',
  PasswordSignInInputBodySession.cookie: 'cookie',
  PasswordSignInInputBodySession.$unknown: r'$unknown',
};
