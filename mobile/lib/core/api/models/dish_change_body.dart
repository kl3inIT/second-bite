// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'dish_change_body_kind.dart';

part 'dish_change_body.freezed.dart';
part 'dish_change_body.g.dart';

@Freezed()
abstract class DishChangeBody with _$DishChangeBody {
  const factory DishChangeBody({
    String? description,
    bool? hidden,
    String? ingredients,
    DishChangeBodyKind? kind,

    /// Leaves it as it is when absent, and empties it when the kind is changed from other
    String? kindLabel,

    /// Replaces the photos after the cover; at most two
    List<String>? morePhotoIds,
    String? name,
    int? originalPriceVnd,
    String? photoId,
    String? unit,
  }) = _DishChangeBody;

  factory DishChangeBody.fromJson(Map<String, Object?> json) =>
      _$DishChangeBodyFromJson(json);
}
