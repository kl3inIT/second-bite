// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift_report_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ShiftReportOutputBody _$ShiftReportOutputBodyFromJson(
  Map<String, dynamic> json,
) => _ShiftReportOutputBody(
  days: (json['days'] as List<dynamic>)
      .map((e) => ShiftDayBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  since: DateTime.parse(json['since'] as String),
  totals: ShiftSummaryBody.fromJson(json['totals'] as Map<String, dynamic>),
  until: DateTime.parse(json['until'] as String),
);

Map<String, dynamic> _$ShiftReportOutputBodyToJson(
  _ShiftReportOutputBody instance,
) => <String, dynamic>{
  'days': instance.days,
  'since': instance.since.toIso8601String(),
  'totals': instance.totals,
  'until': instance.until.toIso8601String(),
};
