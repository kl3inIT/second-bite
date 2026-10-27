// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'found_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_FoundBody _$FoundBodyFromJson(Map<String, dynamic> json) => _FoundBody(
  collectionPoint: CollectionPointBody.fromJson(
    json['collectionPoint'] as Map<String, dynamic>,
  ),
  createdAt: DateTime.parse(json['createdAt'] as String),
  description: json['description'] as String,
  discountPercent: (json['discountPercent'] as num).toInt(),
  id: json['id'] as String,
  kind: FoundBodyKind.fromJson(json['kind'] as String),
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
  originalPriceVnd: (json['originalPriceVnd'] as num).toInt(),
  photo: OfferPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
  photos: (json['photos'] as List<dynamic>)
      .map((e) => OfferPhotoBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  priceVnd: (json['priceVnd'] as num).toInt(),
  seller: OfferSellerBody.fromJson(json['seller'] as Map<String, dynamic>),
  sellerId: json['sellerId'] as String,
  status: FoundBodyStatus.fromJson(json['status'] as String),
  unit: json['unit'] as String,
  units: (json['units'] as num).toInt(),
  unitsLeft: (json['unitsLeft'] as num).toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  windowEnd: DateTime.parse(json['windowEnd'] as String),
  windowStart: DateTime.parse(json['windowStart'] as String),
  distanceMeters: (json['distanceMeters'] as num?)?.toDouble(),
  weightGrams: (json['weightGrams'] as num?)?.toInt(),
  withdrawnAt: json['withdrawnAt'] == null
      ? null
      : DateTime.parse(json['withdrawnAt'] as String),
);

Map<String, dynamic> _$FoundBodyToJson(_FoundBody instance) =>
    <String, dynamic>{
      'collectionPoint': instance.collectionPoint,
      'createdAt': instance.createdAt.toIso8601String(),
      'description': instance.description,
      'discountPercent': instance.discountPercent,
      'id': instance.id,
      'kind': _$FoundBodyKindEnumMap[instance.kind]!,
      'kindLabel': instance.kindLabel,
      'name': instance.name,
      'originalPriceVnd': instance.originalPriceVnd,
      'photo': instance.photo,
      'photos': instance.photos,
      'priceVnd': instance.priceVnd,
      'seller': instance.seller,
      'sellerId': instance.sellerId,
      'status': _$FoundBodyStatusEnumMap[instance.status]!,
      'unit': instance.unit,
      'units': instance.units,
      'unitsLeft': instance.unitsLeft,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'windowEnd': instance.windowEnd.toIso8601String(),
      'windowStart': instance.windowStart.toIso8601String(),
      'distanceMeters': instance.distanceMeters,
      'weightGrams': instance.weightGrams,
      'withdrawnAt': instance.withdrawnAt?.toIso8601String(),
    };

const _$FoundBodyKindEnumMap = {
  FoundBodyKind.bakery: 'bakery',
  FoundBodyKind.preparedFood: 'prepared_food',
  FoundBodyKind.ingredients: 'ingredients',
  FoundBodyKind.drinks: 'drinks',
  FoundBodyKind.mixedBox: 'mixed_box',
  FoundBodyKind.dessert: 'dessert',
  FoundBodyKind.snacks: 'snacks',
  FoundBodyKind.produce: 'produce',
  FoundBodyKind.other: 'other',
  FoundBodyKind.$unknown: r'$unknown',
};

const _$FoundBodyStatusEnumMap = {
  FoundBodyStatus.onSale: 'on_sale',
  FoundBodyStatus.soldOut: 'sold_out',
  FoundBodyStatus.closed: 'closed',
  FoundBodyStatus.withdrawn: 'withdrawn',
  FoundBodyStatus.$unknown: r'$unknown',
};
