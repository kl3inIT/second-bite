// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PlaceBody _$PlaceBodyFromJson(Map<String, dynamic> json) => _PlaceBody(
  address: json['address'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
);

Map<String, dynamic> _$PlaceBodyToJson(_PlaceBody instance) =>
    <String, dynamic>{
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };
