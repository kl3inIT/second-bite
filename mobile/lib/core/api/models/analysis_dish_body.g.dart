// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_dish_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AnalysisDishBody _$AnalysisDishBodyFromJson(Map<String, dynamic> json) =>
    _AnalysisDishBody(
      collected: (json['collected'] as num).toInt(),
      name: json['name'] as String,
      offerId: json['offerId'] as String,
      posted: (json['posted'] as num).toInt(),
      sellerName: json['sellerName'] as String,
      unit: json['unit'] as String,
    );

Map<String, dynamic> _$AnalysisDishBodyToJson(_AnalysisDishBody instance) =>
    <String, dynamic>{
      'collected': instance.collected,
      'name': instance.name,
      'offerId': instance.offerId,
      'posted': instance.posted,
      'sellerName': instance.sellerName,
      'unit': instance.unit,
    };
