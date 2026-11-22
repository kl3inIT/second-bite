// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_discount_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AnalysisDiscountBody _$AnalysisDiscountBodyFromJson(
  Map<String, dynamic> json,
) => _AnalysisDiscountBody(
  band: AnalysisDiscountBodyBand.fromJson(json['band'] as String),
  collected: (json['collected'] as num).toInt(),
  posted: (json['posted'] as num).toInt(),
);

Map<String, dynamic> _$AnalysisDiscountBodyToJson(
  _AnalysisDiscountBody instance,
) => <String, dynamic>{
  'band': _$AnalysisDiscountBodyBandEnumMap[instance.band]!,
  'collected': instance.collected,
  'posted': instance.posted,
};

const _$AnalysisDiscountBodyBandEnumMap = {
  AnalysisDiscountBodyBand.free: 'free',
  AnalysisDiscountBodyBand.from70: 'from70',
  AnalysisDiscountBodyBand.from50: 'from50',
  AnalysisDiscountBodyBand.from30: 'from30',
  AnalysisDiscountBodyBand.under30: 'under30',
  AnalysisDiscountBodyBand.$unknown: r'$unknown',
};
