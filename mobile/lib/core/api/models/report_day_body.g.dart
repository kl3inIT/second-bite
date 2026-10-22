// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_day_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReportDayBody _$ReportDayBodyFromJson(Map<String, dynamic> json) =>
    _ReportDayBody(
      counts: CountsBody.fromJson(json['counts'] as Map<String, dynamic>),
      day: DateTime.parse(json['day'] as String),
    );

Map<String, dynamic> _$ReportDayBodyToJson(_ReportDayBody instance) =>
    <String, dynamic>{
      'counts': instance.counts,
      'day': instance.day.toIso8601String(),
    };
