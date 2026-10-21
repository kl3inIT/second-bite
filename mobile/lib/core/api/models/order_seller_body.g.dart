// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderSellerBody _$OrderSellerBodyFromJson(Map<String, dynamic> json) =>
    _OrderSellerBody(
      address: json['address'] as String,
      id: json['id'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      name: json['name'] as String,
    );

Map<String, dynamic> _$OrderSellerBodyToJson(_OrderSellerBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'id': instance.id,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'name': instance.name,
    };
