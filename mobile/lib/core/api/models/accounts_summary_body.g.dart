// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'accounts_summary_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AccountsSummaryBody _$AccountsSummaryBodyFromJson(Map<String, dynamic> json) =>
    _AccountsSummaryBody(
      newInRange: (json['newInRange'] as num).toInt(),
      newPerDay: (json['newPerDay'] as List<dynamic>)
          .map((e) => DayCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: (json['total'] as num).toInt(),
    );

Map<String, dynamic> _$AccountsSummaryBodyToJson(
  _AccountsSummaryBody instance,
) => <String, dynamic>{
  'newInRange': instance.newInRange,
  'newPerDay': instance.newPerDay,
  'total': instance.total,
};
