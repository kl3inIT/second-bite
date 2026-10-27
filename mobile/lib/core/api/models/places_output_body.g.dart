// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'places_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PlacesOutputBody _$PlacesOutputBodyFromJson(Map<String, dynamic> json) =>
    _PlacesOutputBody(
      places: (json['places'] as List<dynamic>?)
          ?.map((e) => PlaceBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PlacesOutputBodyToJson(_PlacesOutputBody instance) =>
    <String, dynamic>{'places': instance.places};
