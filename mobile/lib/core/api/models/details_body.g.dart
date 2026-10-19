// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DetailsBody _$DetailsBodyFromJson(Map<String, dynamic> json) => _DetailsBody(
  address: json['address'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  name: json['name'] as String,
  phone: json['phone'] as String,
);

Map<String, dynamic> _$DetailsBodyToJson(_DetailsBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'name': instance.name,
      'phone': instance.phone,
    };
