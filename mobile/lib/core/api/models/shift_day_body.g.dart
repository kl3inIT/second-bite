// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift_day_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ShiftDayBody _$ShiftDayBodyFromJson(Map<String, dynamic> json) =>
    _ShiftDayBody(
      day: DateTime.parse(json['day'] as String),
      shifts: (json['shifts'] as List<dynamic>)
          .map((e) => ShiftBlockBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      summary: ShiftSummaryBody.fromJson(
        json['summary'] as Map<String, dynamic>,
      ),
    );

Map<String, dynamic> _$ShiftDayBodyToJson(_ShiftDayBody instance) =>
    <String, dynamic>{
      'day': instance.day.toIso8601String(),
      'shifts': instance.shifts,
      'summary': instance.summary,
    };
