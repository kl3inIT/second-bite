// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReportOutputBody _$ReportOutputBodyFromJson(Map<String, dynamic> json) =>
    _ReportOutputBody(
      accounts: (json['accounts'] as num).toInt(),
      days: (json['days'] as List<dynamic>?)
          ?.map((e) => ReportDayBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      since: DateTime.parse(json['since'] as String),
      storeDays: (json['storeDays'] as List<dynamic>?)
          ?.map((e) => ReportStoreDayBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      stores: (json['stores'] as List<dynamic>?)
          ?.map((e) => ReportStoreBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      totals: CountsBody.fromJson(json['totals'] as Map<String, dynamic>),
      until: DateTime.parse(json['until'] as String),
    );

Map<String, dynamic> _$ReportOutputBodyToJson(_ReportOutputBody instance) =>
    <String, dynamic>{
      'accounts': instance.accounts,
      'days': instance.days,
      'since': instance.since.toIso8601String(),
      'storeDays': instance.storeDays,
      'stores': instance.stores,
      'totals': instance.totals,
      'until': instance.until.toIso8601String(),
    };
