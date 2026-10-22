// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_store_day_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReportStoreDayBody _$ReportStoreDayBodyFromJson(Map<String, dynamic> json) =>
    _ReportStoreDayBody(
      day: DateTime.parse(json['day'] as String),
      name: json['name'] as String,
      sellerId: json['sellerId'] as String,
    );

Map<String, dynamic> _$ReportStoreDayBodyToJson(_ReportStoreDayBody instance) =>
    <String, dynamic>{
      'day': instance.day.toIso8601String(),
      'name': instance.name,
      'sellerId': instance.sellerId,
    };
