// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferBody _$OfferBodyFromJson(Map<String, dynamic> json) => _OfferBody(
  collectionPoint: CollectionPointBody.fromJson(
    json['collectionPoint'] as Map<String, dynamic>,
  ),
  createdAt: DateTime.parse(json['createdAt'] as String),
  description: json['description'] as String,
  discountPercent: (json['discountPercent'] as num).toInt(),
  id: json['id'] as String,
  kind: OfferBodyKind.fromJson(json['kind'] as String),
  name: json['name'] as String,
  originalPriceVnd: (json['originalPriceVnd'] as num).toInt(),
  photo: OfferPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
  photos: (json['photos'] as List<dynamic>)
      .map((e) => OfferPhotoBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  priceVnd: (json['priceVnd'] as num).toInt(),
  sellerId: json['sellerId'] as String,
  status: OfferBodyStatus.fromJson(json['status'] as String),
  unit: json['unit'] as String,
  units: (json['units'] as num).toInt(),
  unitsLeft: (json['unitsLeft'] as num).toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  windowEnd: DateTime.parse(json['windowEnd'] as String),
  windowStart: DateTime.parse(json['windowStart'] as String),
  weightGrams: (json['weightGrams'] as num?)?.toInt(),
  withdrawnAt: json['withdrawnAt'] == null
      ? null
      : DateTime.parse(json['withdrawnAt'] as String),
);

Map<String, dynamic> _$OfferBodyToJson(_OfferBody instance) =>
    <String, dynamic>{
      'collectionPoint': instance.collectionPoint,
      'createdAt': instance.createdAt.toIso8601String(),
      'description': instance.description,
      'discountPercent': instance.discountPercent,
      'id': instance.id,
      'kind': _$OfferBodyKindEnumMap[instance.kind]!,
      'name': instance.name,
      'originalPriceVnd': instance.originalPriceVnd,
      'photo': instance.photo,
      'photos': instance.photos,
      'priceVnd': instance.priceVnd,
      'sellerId': instance.sellerId,
      'status': _$OfferBodyStatusEnumMap[instance.status]!,
      'unit': instance.unit,
      'units': instance.units,
      'unitsLeft': instance.unitsLeft,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'windowEnd': instance.windowEnd.toIso8601String(),
      'windowStart': instance.windowStart.toIso8601String(),
      'weightGrams': instance.weightGrams,
      'withdrawnAt': instance.withdrawnAt?.toIso8601String(),
    };

const _$OfferBodyKindEnumMap = {
  OfferBodyKind.bakery: 'bakery',
  OfferBodyKind.preparedFood: 'prepared_food',
  OfferBodyKind.ingredients: 'ingredients',
  OfferBodyKind.drinks: 'drinks',
  OfferBodyKind.mixedBox: 'mixed_box',
  OfferBodyKind.other: 'other',
  OfferBodyKind.$unknown: r'$unknown',
};

const _$OfferBodyStatusEnumMap = {
  OfferBodyStatus.onSale: 'on_sale',
  OfferBodyStatus.soldOut: 'sold_out',
  OfferBodyStatus.closed: 'closed',
  OfferBodyStatus.withdrawn: 'withdrawn',
  OfferBodyStatus.$unknown: r'$unknown',
};
