// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dish_change_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DishChangeBody _$DishChangeBodyFromJson(Map<String, dynamic> json) =>
    _DishChangeBody(
      description: json['description'] as String?,
      hidden: json['hidden'] as bool?,
      ingredients: json['ingredients'] as String?,
      kind: json['kind'] == null
          ? null
          : DishChangeBodyKind.fromJson(json['kind'] as String),
      name: json['name'] as String?,
      originalPriceVnd: (json['originalPriceVnd'] as num?)?.toInt(),
      photoId: json['photoId'] as String?,
      unit: json['unit'] as String?,
    );

Map<String, dynamic> _$DishChangeBodyToJson(_DishChangeBody instance) =>
    <String, dynamic>{
      'description': instance.description,
      'hidden': instance.hidden,
      'ingredients': instance.ingredients,
      'kind': _$DishChangeBodyKindEnumMap[instance.kind],
      'name': instance.name,
      'originalPriceVnd': instance.originalPriceVnd,
      'photoId': instance.photoId,
      'unit': instance.unit,
    };

const _$DishChangeBodyKindEnumMap = {
  DishChangeBodyKind.bakery: 'bakery',
  DishChangeBodyKind.preparedFood: 'prepared_food',
  DishChangeBodyKind.ingredients: 'ingredients',
  DishChangeBodyKind.drinks: 'drinks',
  DishChangeBodyKind.mixedBox: 'mixed_box',
  DishChangeBodyKind.other: 'other',
  DishChangeBodyKind.$unknown: r'$unknown',
};
