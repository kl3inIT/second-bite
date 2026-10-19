// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sellers_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellersOutputBody _$SellersOutputBodyFromJson(Map<String, dynamic> json) =>
    _SellersOutputBody(
      sellers: (json['sellers'] as List<dynamic>?)
          ?.map((e) => SellerBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$SellersOutputBodyToJson(_SellersOutputBody instance) =>
    <String, dynamic>{'sellers': instance.sellers};
