// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferSellerBody _$OfferSellerBodyFromJson(Map<String, dynamic> json) =>
    _OfferSellerBody(
      address: json['address'] as String,
      id: json['id'] as String,
      name: json['name'] as String,
      photo: json['photo'] == null
          ? null
          : OfferPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$OfferSellerBodyToJson(_OfferSellerBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'id': instance.id,
      'name': instance.name,
      'photo': instance.photo,
    };
