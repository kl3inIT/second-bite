// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'opened_seller_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OpenedSellerBody _$OpenedSellerBodyFromJson(Map<String, dynamic> json) =>
    _OpenedSellerBody(
      id: json['id'] as String,
      name: json['name'] as String,
      openedAt: DateTime.parse(json['openedAt'] as String),
    );

Map<String, dynamic> _$OpenedSellerBodyToJson(_OpenedSellerBody instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'openedAt': instance.openedAt.toIso8601String(),
    };
