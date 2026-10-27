// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferDetailsBody _$OfferDetailsBodyFromJson(Map<String, dynamic> json) =>
    _OfferDetailsBody(
      kind: OfferDetailsBodyKind.fromJson(json['kind'] as String),
      name: json['name'] as String,
      originalPriceVnd: (json['originalPriceVnd'] as num).toInt(),
      photoId: json['photoId'] as String,
      priceVnd: (json['priceVnd'] as num).toInt(),
      units: (json['units'] as num).toInt(),
      windowEnd: DateTime.parse(json['windowEnd'] as String),
      windowStart: DateTime.parse(json['windowStart'] as String),
      description: json['description'] as String?,
      kindLabel: json['kindLabel'] as String?,
      morePhotoIds: (json['morePhotoIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      unit: json['unit'] as String?,
      weightGrams: (json['weightGrams'] as num?)?.toInt(),
    );

Map<String, dynamic> _$OfferDetailsBodyToJson(_OfferDetailsBody instance) =>
    <String, dynamic>{
      'kind': _$OfferDetailsBodyKindEnumMap[instance.kind]!,
      'name': instance.name,
      'originalPriceVnd': instance.originalPriceVnd,
      'photoId': instance.photoId,
      'priceVnd': instance.priceVnd,
      'units': instance.units,
      'windowEnd': instance.windowEnd.toIso8601String(),
      'windowStart': instance.windowStart.toIso8601String(),
      'description': instance.description,
      'kindLabel': instance.kindLabel,
      'morePhotoIds': instance.morePhotoIds,
      'unit': instance.unit,
      'weightGrams': instance.weightGrams,
    };

const _$OfferDetailsBodyKindEnumMap = {
  OfferDetailsBodyKind.bakery: 'bakery',
  OfferDetailsBodyKind.preparedFood: 'prepared_food',
  OfferDetailsBodyKind.ingredients: 'ingredients',
  OfferDetailsBodyKind.drinks: 'drinks',
  OfferDetailsBodyKind.mixedBox: 'mixed_box',
  OfferDetailsBodyKind.dessert: 'dessert',
  OfferDetailsBodyKind.snacks: 'snacks',
  OfferDetailsBodyKind.produce: 'produce',
  OfferDetailsBodyKind.other: 'other',
  OfferDetailsBodyKind.$unknown: r'$unknown',
};
