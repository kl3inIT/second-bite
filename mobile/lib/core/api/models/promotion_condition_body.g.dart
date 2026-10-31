// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_condition_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionConditionBody _$PromotionConditionBodyFromJson(
  Map<String, dynamic> json,
) => _PromotionConditionBody(
  attribute: PromotionConditionBodyAttribute.fromJson(
    json['attribute'] as String,
  ),
  operatorEnum: PromotionConditionBodyOperatorEnum.fromJson(
    json['operator'] as String,
  ),
  values: (json['values'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$PromotionConditionBodyToJson(
  _PromotionConditionBody instance,
) => <String, dynamic>{
  'attribute': _$PromotionConditionBodyAttributeEnumMap[instance.attribute]!,
  'operator':
      _$PromotionConditionBodyOperatorEnumEnumMap[instance.operatorEnum]!,
  'values': instance.values,
};

const _$PromotionConditionBodyAttributeEnumMap = {
  PromotionConditionBodyAttribute.customer: 'customer',
  PromotionConditionBodyAttribute.seller: 'seller',
  PromotionConditionBodyAttribute.subtotal: 'subtotal',
  PromotionConditionBodyAttribute.$unknown: r'$unknown',
};

const _$PromotionConditionBodyOperatorEnumEnumMap = {
  PromotionConditionBodyOperatorEnum.eq: 'eq',
  PromotionConditionBodyOperatorEnum.valueIn: 'in',
  PromotionConditionBodyOperatorEnum.notIn: 'not_in',
  PromotionConditionBodyOperatorEnum.gte: 'gte',
  PromotionConditionBodyOperatorEnum.lt: 'lt',
  PromotionConditionBodyOperatorEnum.$unknown: r'$unknown',
};
