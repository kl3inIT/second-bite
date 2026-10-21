// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_line_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderLineBody _$OrderLineBodyFromJson(Map<String, dynamic> json) =>
    _OrderLineBody(
      name: json['name'] as String,
      offerId: json['offerId'] as String,
      originalPriceVnd: (json['originalPriceVnd'] as num).toInt(),
      photo: OrderLinePhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
      priceVnd: (json['priceVnd'] as num).toInt(),
      unit: json['unit'] as String,
      units: (json['units'] as num).toInt(),
    );

Map<String, dynamic> _$OrderLineBodyToJson(_OrderLineBody instance) =>
    <String, dynamic>{
      'name': instance.name,
      'offerId': instance.offerId,
      'originalPriceVnd': instance.originalPriceVnd,
      'photo': instance.photo,
      'priceVnd': instance.priceVnd,
      'unit': instance.unit,
      'units': instance.units,
    };
