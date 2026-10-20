// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'latest_offer_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LatestOfferBody _$LatestOfferBodyFromJson(Map<String, dynamic> json) =>
    _LatestOfferBody(
      id: json['id'] as String,
      name: json['name'] as String,
      postedAt: DateTime.parse(json['postedAt'] as String),
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
    );

Map<String, dynamic> _$LatestOfferBodyToJson(_LatestOfferBody instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'postedAt': instance.postedAt.toIso8601String(),
      'sellerId': instance.sellerId,
      'sellerName': instance.sellerName,
    };
