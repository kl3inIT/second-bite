// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_wanted_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderWantedBody _$OrderWantedBodyFromJson(Map<String, dynamic> json) =>
    _OrderWantedBody(
      offerId: json['offerId'] as String,
      units: (json['units'] as num).toInt(),
    );

Map<String, dynamic> _$OrderWantedBodyToJson(_OrderWantedBody instance) =>
    <String, dynamic>{'offerId': instance.offerId, 'units': instance.units};
