// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'change_password_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ChangePasswordInputBody _$ChangePasswordInputBodyFromJson(
  Map<String, dynamic> json,
) => _ChangePasswordInputBody(
  currentPassword: json['currentPassword'] as String,
  newPassword: json['newPassword'] as String,
);

Map<String, dynamic> _$ChangePasswordInputBodyToJson(
  _ChangePasswordInputBody instance,
) => <String, dynamic>{
  'currentPassword': instance.currentPassword,
  'newPassword': instance.newPassword,
};
