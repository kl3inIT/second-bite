// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'apple_sign_in_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AppleSignInInputBody _$AppleSignInInputBodyFromJson(
  Map<String, dynamic> json,
) => _AppleSignInInputBody(
  authorizationCode: json['authorizationCode'] as String,
  idToken: json['idToken'] as String,
  nonce: json['nonce'] as String,
  session: json['session'] == null
      ? AppleSignInInputBodySession.token
      : AppleSignInInputBodySession.fromJson(json['session'] as String),
  familyName: json['familyName'] as String?,
  givenName: json['givenName'] as String?,
);

Map<String, dynamic> _$AppleSignInInputBodyToJson(
  _AppleSignInInputBody instance,
) => <String, dynamic>{
  'authorizationCode': instance.authorizationCode,
  'idToken': instance.idToken,
  'nonce': instance.nonce,
  'session': _$AppleSignInInputBodySessionEnumMap[instance.session]!,
  'familyName': instance.familyName,
  'givenName': instance.givenName,
};

const _$AppleSignInInputBodySessionEnumMap = {
  AppleSignInInputBodySession.token: 'token',
  AppleSignInInputBodySession.cookie: 'cookie',
  AppleSignInInputBodySession.$unknown: r'$unknown',
};
