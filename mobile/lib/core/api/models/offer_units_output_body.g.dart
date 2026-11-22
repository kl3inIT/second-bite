// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_units_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferUnitsOutputBody _$OfferUnitsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _OfferUnitsOutputBody(
  collected: (json['collected'] as num).toInt(),
  collectedOrders: (json['collectedOrders'] as num).toInt(),
  held: (json['held'] as num).toInt(),
  heldOrders: (json['heldOrders'] as num).toInt(),
  left: (json['left'] as num).toInt(),
  leftover: (json['leftover'] as num).toInt(),
  missed: (json['missed'] as num).toInt(),
  missedOrders: (json['missedOrders'] as num).toInt(),
  posted: (json['posted'] as num).toInt(),
  posts: (json['posts'] as num).toInt(),
);

Map<String, dynamic> _$OfferUnitsOutputBodyToJson(
  _OfferUnitsOutputBody instance,
) => <String, dynamic>{
  'collected': instance.collected,
  'collectedOrders': instance.collectedOrders,
  'held': instance.held,
  'heldOrders': instance.heldOrders,
  'left': instance.left,
  'leftover': instance.leftover,
  'missed': instance.missed,
  'missedOrders': instance.missedOrders,
  'posted': instance.posted,
  'posts': instance.posts,
};
