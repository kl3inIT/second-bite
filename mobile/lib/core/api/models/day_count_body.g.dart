// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'day_count_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DayCountBody _$DayCountBodyFromJson(Map<String, dynamic> json) =>
    _DayCountBody(
      count: (json['count'] as num).toInt(),
      date: DateTime.parse(json['date'] as String),
    );

Map<String, dynamic> _$DayCountBodyToJson(_DayCountBody instance) =>
    <String, dynamic>{
      'count': instance.count,
      'date': instance.date.toIso8601String(),
    };
