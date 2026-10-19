// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'offer_details_body_kind.dart';

part 'offer_details_body.freezed.dart';
part 'offer_details_body.g.dart';

@Freezed()
abstract class OfferDetailsBody with _$OfferDetailsBody {
  const factory OfferDetailsBody({
    required OfferDetailsBodyKind kind,
    required String name,

    /// What one unit normally sells for; the price must be the minimum discount below it
    required int originalPriceVnd,

    /// From POST /photos, or the photo of an earlier offer of the seller
    required String photoId,

    /// Price of one unit, in whole đồng
    required int priceVnd,
    required int units,

    /// The last handover
    required DateTime windowEnd,

    /// When the offer is ready to collect
    required DateTime windowStart,

    /// Required for a mixed_box, which is described by what it may hold; allergens are written here
    String? description,

    /// What one unit is called; "suất" when empty
    String? unit,

    /// Weight of one unit, to measure food saved
    int? weightGrams,
  }) = _OfferDetailsBody;

  factory OfferDetailsBody.fromJson(Map<String, Object?> json) =>
      _$OfferDetailsBodyFromJson(json);
}
