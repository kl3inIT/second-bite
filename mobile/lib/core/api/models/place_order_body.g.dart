// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_order_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PlaceOrderBody _$PlaceOrderBodyFromJson(Map<String, dynamic> json) =>
    _PlaceOrderBody(
      lines: (json['lines'] as List<dynamic>?)
          ?.map((e) => OrderWantedBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      name: json['name'] as String,
      phone: json['phone'] as String,
      byZalo: json['byZalo'] as bool?,
      checkoutId: json['checkoutId'] as String?,
    );

Map<String, dynamic> _$PlaceOrderBodyToJson(_PlaceOrderBody instance) =>
    <String, dynamic>{
      'lines': instance.lines,
      'name': instance.name,
      'phone': instance.phone,
      'byZalo': instance.byZalo,
      'checkoutId': instance.checkoutId,
    };
