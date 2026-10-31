// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionCountsBody _$PromotionCountsBodyFromJson(Map<String, dynamic> json) =>
    _PromotionCountsBody(
      ended: (json['ended'] as num).toInt(),
      paused: (json['paused'] as num).toInt(),
      running: (json['running'] as num).toInt(),
      scheduled: (json['scheduled'] as num).toInt(),
    );

Map<String, dynamic> _$PromotionCountsBodyToJson(
  _PromotionCountsBody instance,
) => <String, dynamic>{
  'ended': instance.ended,
  'paused': instance.paused,
  'running': instance.running,
  'scheduled': instance.scheduled,
};
