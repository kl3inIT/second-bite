// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CountsBody _$CountsBodyFromJson(Map<String, dynamic> json) => _CountsBody(
  cancelled: (json['cancelled'] as num).toInt(),
  collected: (json['collected'] as num).toInt(),
  collectedVnd: (json['collectedVnd'] as num).toInt(),
  expired: (json['expired'] as num).toInt(),
  held: (json['held'] as num).toInt(),
  homeViews: (json['homeViews'] as num).toInt(),
  offers: (json['offers'] as num).toInt(),
  people: (json['people'] as num).toInt(),
  qrViews: (json['qrViews'] as num).toInt(),
  refused: (json['refused'] as num).toInt(),
  unitsCollected: (json['unitsCollected'] as num).toInt(),
  unitsHeld: (json['unitsHeld'] as num).toInt(),
  unitsPosted: (json['unitsPosted'] as num).toInt(),
  views: (json['views'] as num).toInt(),
);

Map<String, dynamic> _$CountsBodyToJson(_CountsBody instance) =>
    <String, dynamic>{
      'cancelled': instance.cancelled,
      'collected': instance.collected,
      'collectedVnd': instance.collectedVnd,
      'expired': instance.expired,
      'held': instance.held,
      'homeViews': instance.homeViews,
      'offers': instance.offers,
      'people': instance.people,
      'qrViews': instance.qrViews,
      'refused': instance.refused,
      'unitsCollected': instance.unitsCollected,
      'unitsHeld': instance.unitsHeld,
      'unitsPosted': instance.unitsPosted,
      'views': instance.views,
    };
