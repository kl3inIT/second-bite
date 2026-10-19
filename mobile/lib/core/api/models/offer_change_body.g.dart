// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_change_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferChangeBody _$OfferChangeBodyFromJson(Map<String, dynamic> json) =>
    _OfferChangeBody(
      description: json['description'] as String?,
      kind: json['kind'] == null
          ? null
          : OfferChangeBodyKind.fromJson(json['kind'] as String),
      name: json['name'] as String?,
      originalPriceVnd: (json['originalPriceVnd'] as num?)?.toInt(),
      photoId: json['photoId'] as String?,
      priceVnd: (json['priceVnd'] as num?)?.toInt(),
      unit: json['unit'] as String?,
      units: (json['units'] as num?)?.toInt(),
      weightGrams: (json['weightGrams'] as num?)?.toInt(),
      windowEnd: json['windowEnd'] == null
          ? null
          : DateTime.parse(json['windowEnd'] as String),
      windowStart: json['windowStart'] == null
          ? null
          : DateTime.parse(json['windowStart'] as String),
    );

Map<String, dynamic> _$OfferChangeBodyToJson(_OfferChangeBody instance) =>
    <String, dynamic>{
      'description': instance.description,
      'kind': _$OfferChangeBodyKindEnumMap[instance.kind],
      'name': instance.name,
      'originalPriceVnd': instance.originalPriceVnd,
      'photoId': instance.photoId,
      'priceVnd': instance.priceVnd,
      'unit': instance.unit,
      'units': instance.units,
      'weightGrams': instance.weightGrams,
      'windowEnd': instance.windowEnd?.toIso8601String(),
      'windowStart': instance.windowStart?.toIso8601String(),
    };

const _$OfferChangeBodyKindEnumMap = {
  OfferChangeBodyKind.bakery: 'bakery',
  OfferChangeBodyKind.preparedFood: 'prepared_food',
  OfferChangeBodyKind.ingredients: 'ingredients',
  OfferChangeBodyKind.drinks: 'drinks',
  OfferChangeBodyKind.mixedBox: 'mixed_box',
  OfferChangeBodyKind.other: 'other',
  OfferChangeBodyKind.$unknown: r'$unknown',
};
