// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_sign_in_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_GoogleSignInInputBody _$GoogleSignInInputBodyFromJson(
  Map<String, dynamic> json,
) => _GoogleSignInInputBody(
  idToken: json['idToken'] as String,
  session: json['session'] == null
      ? GoogleSignInInputBodySession.token
      : GoogleSignInInputBodySession.fromJson(json['session'] as String),
  nonce: json['nonce'] as String?,
);

Map<String, dynamic> _$GoogleSignInInputBodyToJson(
  _GoogleSignInInputBody instance,
) => <String, dynamic>{
  'idToken': instance.idToken,
  'session': _$GoogleSignInInputBodySessionEnumMap[instance.session]!,
  'nonce': instance.nonce,
};

const _$GoogleSignInInputBodySessionEnumMap = {
  GoogleSignInInputBodySession.token: 'token',
  GoogleSignInInputBodySession.cookie: 'cookie',
  GoogleSignInInputBodySession.$unknown: r'$unknown',
};
