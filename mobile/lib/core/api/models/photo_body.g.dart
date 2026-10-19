// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'photo_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PhotoBody _$PhotoBodyFromJson(Map<String, dynamic> json) => _PhotoBody(
  height: (json['height'] as num).toInt(),
  id: json['id'] as String,
  largePath: json['largePath'] as String,
  smallPath: json['smallPath'] as String,
  width: (json['width'] as num).toInt(),
);

Map<String, dynamic> _$PhotoBodyToJson(_PhotoBody instance) =>
    <String, dynamic>{
      'height': instance.height,
      'id': instance.id,
      'largePath': instance.largePath,
      'smallPath': instance.smallPath,
      'width': instance.width,
    };
