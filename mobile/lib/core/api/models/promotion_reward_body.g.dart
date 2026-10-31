// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_reward_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionRewardBody _$PromotionRewardBodyFromJson(Map<String, dynamic> json) =>
    _PromotionRewardBody(
      type: PromotionRewardBodyType.fromJson(json['type'] as String),
      value: (json['value'] as num).toInt(),
      maxVnd: (json['maxVnd'] as num?)?.toInt(),
    );

Map<String, dynamic> _$PromotionRewardBodyToJson(
  _PromotionRewardBody instance,
) => <String, dynamic>{
  'type': _$PromotionRewardBodyTypeEnumMap[instance.type]!,
  'value': instance.value,
  'maxVnd': instance.maxVnd,
};

const _$PromotionRewardBodyTypeEnumMap = {
  PromotionRewardBodyType.fixed: 'fixed',
  PromotionRewardBodyType.percentage: 'percentage',
  PromotionRewardBodyType.$unknown: r'$unknown',
};
