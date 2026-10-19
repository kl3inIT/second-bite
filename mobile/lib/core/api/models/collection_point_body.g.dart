// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'collection_point_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CollectionPointBody _$CollectionPointBodyFromJson(Map<String, dynamic> json) =>
    _CollectionPointBody(
      address: json['address'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );

Map<String, dynamic> _$CollectionPointBodyToJson(
  _CollectionPointBody instance,
) => <String, dynamic>{
  'address': instance.address,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};
