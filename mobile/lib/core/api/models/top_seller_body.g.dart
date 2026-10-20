// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'top_seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_TopSellerBody _$TopSellerBodyFromJson(Map<String, dynamic> json) =>
    _TopSellerBody(
      name: json['name'] as String,
      offers: (json['offers'] as num).toInt(),
      sellerId: json['sellerId'] as String,
    );

Map<String, dynamic> _$TopSellerBodyToJson(_TopSellerBody instance) =>
    <String, dynamic>{
      'name': instance.name,
      'offers': instance.offers,
      'sellerId': instance.sellerId,
    };
