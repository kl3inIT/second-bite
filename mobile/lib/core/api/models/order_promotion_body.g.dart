// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_promotion_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderPromotionBody _$OrderPromotionBodyFromJson(Map<String, dynamic> json) =>
    _OrderPromotionBody(
      id: json['id'] as String,
      name: json['name'] as String,
      newCustomer: json['newCustomer'] as bool,
      rule: json['rule'] as String,
    );

Map<String, dynamic> _$OrderPromotionBodyToJson(_OrderPromotionBody instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'newCustomer': instance.newCustomer,
      'rule': instance.rule,
    };
