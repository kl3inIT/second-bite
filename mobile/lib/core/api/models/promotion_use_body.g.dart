// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_use_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionUseBody _$PromotionUseBodyFromJson(Map<String, dynamic> json) =>
    _PromotionUseBody(
      heldVnd: (json['heldVnd'] as num).toInt(),
      leftVnd: (json['leftVnd'] as num).toInt(),
      newCustomers: (json['newCustomers'] as num).toInt(),
      orders: (json['orders'] as num).toInt(),
      sellers: (json['sellers'] as num).toInt(),
      spentVnd: (json['spentVnd'] as num).toInt(),
    );

Map<String, dynamic> _$PromotionUseBodyToJson(_PromotionUseBody instance) =>
    <String, dynamic>{
      'heldVnd': instance.heldVnd,
      'leftVnd': instance.leftVnd,
      'newCustomers': instance.newCustomers,
      'orders': instance.orders,
      'sellers': instance.sellers,
      'spentVnd': instance.spentVnd,
    };
