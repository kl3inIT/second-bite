// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dish_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_DishBody _$DishBodyFromJson(Map<String, dynamic> json) => _DishBody(
  createdAt: DateTime.parse(json['createdAt'] as String),
  description: json['description'] as String,
  hidden: json['hidden'] as bool,
  id: json['id'] as String,
  ingredients: json['ingredients'] as String,
  kind: DishBodyKind.fromJson(json['kind'] as String),
  name: json['name'] as String,
  photo: OfferPhotoBody.fromJson(json['photo'] as Map<String, dynamic>),
  sellerId: json['sellerId'] as String,
  unit: json['unit'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  originalPriceVnd: (json['originalPriceVnd'] as num?)?.toInt(),
);

Map<String, dynamic> _$DishBodyToJson(_DishBody instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'description': instance.description,
  'hidden': instance.hidden,
  'id': instance.id,
  'ingredients': instance.ingredients,
  'kind': _$DishBodyKindEnumMap[instance.kind]!,
  'name': instance.name,
  'photo': instance.photo,
  'sellerId': instance.sellerId,
  'unit': instance.unit,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'originalPriceVnd': instance.originalPriceVnd,
};

const _$DishBodyKindEnumMap = {
  DishBodyKind.bakery: 'bakery',
  DishBodyKind.preparedFood: 'prepared_food',
  DishBodyKind.ingredients: 'ingredients',
  DishBodyKind.drinks: 'drinks',
  DishBodyKind.mixedBox: 'mixed_box',
  DishBodyKind.other: 'other',
  DishBodyKind.$unknown: r'$unknown',
};
