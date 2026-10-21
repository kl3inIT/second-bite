// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'dish_body.dart';

part 'list_dishes_response.freezed.dart';
part 'list_dishes_response.g.dart';

@Freezed()
abstract class ListDishesResponse with _$ListDishesResponse {
  const factory ListDishesResponse({required List<DishBody> dishes}) =
      _ListDishesResponse;

  factory ListDishesResponse.fromJson(Map<String, Object?> json) =>
      _$ListDishesResponseFromJson(json);
}
