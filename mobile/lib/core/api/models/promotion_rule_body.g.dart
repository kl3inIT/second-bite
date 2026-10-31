// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_rule_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionRuleBody _$PromotionRuleBodyFromJson(
  Map<String, dynamic> json,
) => _PromotionRuleBody(
  conditions: (json['conditions'] as List<dynamic>)
      .map((e) => PromotionConditionBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  name: json['name'] as String,
  reward: PromotionRewardBody.fromJson(json['reward'] as Map<String, dynamic>),
);

Map<String, dynamic> _$PromotionRuleBodyToJson(_PromotionRuleBody instance) =>
    <String, dynamic>{
      'conditions': instance.conditions,
      'name': instance.name,
      'reward': instance.reward,
    };
