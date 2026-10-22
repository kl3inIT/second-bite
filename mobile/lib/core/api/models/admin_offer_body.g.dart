// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_offer_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminOfferBody _$AdminOfferBodyFromJson(Map<String, dynamic> json) =>
    _AdminOfferBody(
      offer: OfferBody.fromJson(json['offer'] as Map<String, dynamic>),
      sellerName: json['sellerName'] as String,
    );

Map<String, dynamic> _$AdminOfferBodyToJson(_AdminOfferBody instance) =>
    <String, dynamic>{
      'offer': instance.offer,
      'sellerName': instance.sellerName,
    };
