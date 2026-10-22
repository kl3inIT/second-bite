// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report_store_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReportStoreBody _$ReportStoreBodyFromJson(Map<String, dynamic> json) =>
    _ReportStoreBody(
      counts: CountsBody.fromJson(json['counts'] as Map<String, dynamic>),
      name: json['name'] as String,
      sellerId: json['sellerId'] as String,
    );

Map<String, dynamic> _$ReportStoreBodyToJson(_ReportStoreBody instance) =>
    <String, dynamic>{
      'counts': instance.counts,
      'name': instance.name,
      'sellerId': instance.sellerId,
    };
