// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_dishes_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ListDishesResponse _$ListDishesResponseFromJson(Map<String, dynamic> json) =>
    _ListDishesResponse(
      dishes: (json['dishes'] as List<dynamic>)
          .map((e) => DishBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ListDishesResponseToJson(_ListDishesResponse instance) =>
    <String, dynamic>{'dishes': instance.dishes};
