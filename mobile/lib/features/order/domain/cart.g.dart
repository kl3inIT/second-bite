// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cart.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CartLine _$CartLineFromJson(Map<String, dynamic> json) => _CartLine(
  id: json['id'] as String,
  name: json['name'] as String,
  priceVnd: (json['priceVnd'] as num).toInt(),
  originalPriceVnd: (json['originalPriceVnd'] as num).toInt(),
  unitsLeft: (json['unitsLeft'] as num).toInt(),
  windowStart: DateTime.parse(json['windowStart'] as String),
  windowEnd: DateTime.parse(json['windowEnd'] as String),
  quantity: (json['quantity'] as num).toInt(),
  photo: json['photo'] == null
      ? null
      : OfferPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
);

Map<String, dynamic> _$CartLineToJson(_CartLine instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'priceVnd': instance.priceVnd,
  'originalPriceVnd': instance.originalPriceVnd,
  'unitsLeft': instance.unitsLeft,
  'windowStart': instance.windowStart.toIso8601String(),
  'windowEnd': instance.windowEnd.toIso8601String(),
  'quantity': instance.quantity,
  'photo': instance.photo,
};

_Basket _$BasketFromJson(Map<String, dynamic> json) => _Basket(
  seller: OfferSellerBody.fromJson(json['seller'] as Map<String, dynamic>),
  collectionPoint: CollectionPointBody.fromJson(
    json['collectionPoint'] as Map<String, dynamic>,
  ),
  lines: (json['lines'] as List<dynamic>)
      .map((e) => CartLine.fromJson(e as Map<String, dynamic>))
      .toList(),
  distanceMeters: (json['distanceMeters'] as num?)?.toDouble(),
);

Map<String, dynamic> _$BasketToJson(_Basket instance) => <String, dynamic>{
  'seller': instance.seller,
  'collectionPoint': instance.collectionPoint,
  'lines': instance.lines,
  'distanceMeters': instance.distanceMeters,
};

_Cart _$CartFromJson(Map<String, dynamic> json) => _Cart(
  baskets: (json['baskets'] as List<dynamic>)
      .map((e) => Basket.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$CartToJson(_Cart instance) => <String, dynamic>{
  'baskets': instance.baskets,
};
