// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'record_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RecordBody _$RecordBodyFromJson(Map<String, dynamic> json) => _RecordBody(
  createdAt: DateTime.parse(json['createdAt'] as String),
  lastSignInMethod: json['lastSignInMethod'] == null
      ? null
      : RecordBodyLastSignInMethod.fromJson(json['lastSignInMethod'] as String),
  lastSignedInAt: json['lastSignedInAt'] == null
      ? null
      : DateTime.parse(json['lastSignedInAt'] as String),
);

Map<String, dynamic> _$RecordBodyToJson(_RecordBody instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'lastSignInMethod':
          _$RecordBodyLastSignInMethodEnumMap[instance.lastSignInMethod],
      'lastSignedInAt': instance.lastSignedInAt?.toIso8601String(),
    };

const _$RecordBodyLastSignInMethodEnumMap = {
  RecordBodyLastSignInMethod.code: 'code',
  RecordBodyLastSignInMethod.google: 'google',
  RecordBodyLastSignInMethod.$unknown: r'$unknown',
};
