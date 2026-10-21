// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_line_photo_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderLinePhotoBody _$OrderLinePhotoBodyFromJson(Map<String, dynamic> json) =>
    _OrderLinePhotoBody(
      id: json['id'] as String,
      largePath: json['largePath'] as String,
      smallPath: json['smallPath'] as String,
    );

Map<String, dynamic> _$OrderLinePhotoBodyToJson(_OrderLinePhotoBody instance) =>
    <String, dynamic>{
      'id': instance.id,
      'largePath': instance.largePath,
      'smallPath': instance.smallPath,
    };
