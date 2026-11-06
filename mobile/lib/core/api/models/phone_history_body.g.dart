// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'phone_history_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PhoneHistoryBody _$PhoneHistoryBodyFromJson(Map<String, dynamic> json) =>
    _PhoneHistoryBody(
      missed: (json['missed'] as num).toInt(),
      open: (json['open'] as num).toInt(),
    );

Map<String, dynamic> _$PhoneHistoryBodyToJson(_PhoneHistoryBody instance) =>
    <String, dynamic>{'missed': instance.missed, 'open': instance.open};
