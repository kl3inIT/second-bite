// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'dish_details_body_kind.dart';

part 'dish_details_body.freezed.dart';
part 'dish_details_body.g.dart';

@Freezed()
abstract class DishDetailsBody with _$DishDetailsBody {
  const factory DishDetailsBody({
    required DishDetailsBodyKind kind,
    required String name,

    /// The cover: from POST /photos, or a photo the seller already shows
    required String photoId,
    String? description,

    /// Keeps the dish out of the list a post is picked from
    bool? hidden,

    /// What the dish is made of and may contain, allergens included
    String? ingredients,

    /// Up to two more photos after the cover
    List<String>? morePhotoIds,

    /// What one unit normally sells for; a post starts from it
    int? originalPriceVnd,

    /// What one unit is called; "suất" when empty
    String? unit,
  }) = _DishDetailsBody;

  factory DishDetailsBody.fromJson(Map<String, Object?> json) =>
      _$DishDetailsBodyFromJson(json);
}
