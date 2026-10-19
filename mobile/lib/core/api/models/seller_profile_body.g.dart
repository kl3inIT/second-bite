// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_profile_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellerProfileBody _$SellerProfileBodyFromJson(Map<String, dynamic> json) =>
    _SellerProfileBody(
      address: json['address'] as String,
      id: json['id'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      name: json['name'] as String,
      photo: json['photo'] == null
          ? null
          : SellerPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$SellerProfileBodyToJson(_SellerProfileBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'id': instance.id,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'name': instance.name,
      'photo': instance.photo,
    };
