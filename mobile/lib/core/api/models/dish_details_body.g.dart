// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dish_details_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DishDetailsBody _$DishDetailsBodyFromJson(Map<String, dynamic> json) =>
    _DishDetailsBody(
      kind: DishDetailsBodyKind.fromJson(json['kind'] as String),
      name: json['name'] as String,
      photoId: json['photoId'] as String,
      description: json['description'] as String?,
      hidden: json['hidden'] as bool?,
      ingredients: json['ingredients'] as String?,
      originalPriceVnd: (json['originalPriceVnd'] as num?)?.toInt(),
      unit: json['unit'] as String?,
    );

Map<String, dynamic> _$DishDetailsBodyToJson(_DishDetailsBody instance) =>
    <String, dynamic>{
      'kind': _$DishDetailsBodyKindEnumMap[instance.kind]!,
      'name': instance.name,
      'photoId': instance.photoId,
      'description': instance.description,
      'hidden': instance.hidden,
      'ingredients': instance.ingredients,
      'originalPriceVnd': instance.originalPriceVnd,
      'unit': instance.unit,
    };

const _$DishDetailsBodyKindEnumMap = {
  DishDetailsBodyKind.bakery: 'bakery',
  DishDetailsBodyKind.preparedFood: 'prepared_food',
  DishDetailsBodyKind.ingredients: 'ingredients',
  DishDetailsBodyKind.drinks: 'drinks',
  DishDetailsBodyKind.mixedBox: 'mixed_box',
  DishDetailsBodyKind.other: 'other',
  DishDetailsBodyKind.$unknown: r'$unknown',
};
