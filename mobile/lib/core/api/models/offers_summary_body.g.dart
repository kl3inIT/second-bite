// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offers_summary_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OffersSummaryBody _$OffersSummaryBodyFromJson(Map<String, dynamic> json) =>
    _OffersSummaryBody(
      latest: (json['latest'] as List<dynamic>)
          .map((e) => LatestOfferBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      onSaleNow: (json['onSaleNow'] as num).toInt(),
      postedInRange: (json['postedInRange'] as num).toInt(),
      postedPerDay: (json['postedPerDay'] as List<dynamic>)
          .map((e) => DayCountBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      soldOutNow: (json['soldOutNow'] as num).toInt(),
      topSellers: (json['topSellers'] as List<dynamic>)
          .map((e) => TopSellerBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      unitsPostedInRange: (json['unitsPostedInRange'] as num).toInt(),
    );

Map<String, dynamic> _$OffersSummaryBodyToJson(_OffersSummaryBody instance) =>
    <String, dynamic>{
      'latest': instance.latest,
      'onSaleNow': instance.onSaleNow,
      'postedInRange': instance.postedInRange,
      'postedPerDay': instance.postedPerDay,
      'soldOutNow': instance.soldOutNow,
      'topSellers': instance.topSellers,
      'unitsPostedInRange': instance.unitsPostedInRange,
    };
