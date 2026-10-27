// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'dish_body_kind.dart';
import 'offer_photo_body.dart';

part 'dish_body.freezed.dart';
part 'dish_body.g.dart';

@Freezed()
abstract class DishBody with _$DishBody {
  const factory DishBody({
    required DateTime createdAt,
    required String description,
    required bool hidden,
    required String id,
    required String ingredients,
    required DishBodyKind kind,

    /// What the seller calls a dish of the kind other; empty for any other kind
    required String kindLabel,
    required String name,
    required OfferPhotoBody photo,

    /// Every photo, the cover first
    required List<OfferPhotoBody> photos,
    required String sellerId,
    required String unit,
    required DateTime updatedAt,
    int? originalPriceVnd,
  }) = _DishBody;

  factory DishBody.fromJson(Map<String, Object?> json) =>
      _$DishBodyFromJson(json);
}
