// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'offer_change_body_kind.dart';

part 'offer_change_body.freezed.dart';
part 'offer_change_body.g.dart';

@Freezed()
abstract class OfferChangeBody with _$OfferChangeBody {
  const factory OfferChangeBody({
    String? description,
    OfferChangeBodyKind? kind,

    /// Leaves it as it is when absent, and empties it when the kind is changed from other
    String? kindLabel,

    /// Replaces the photos after the cover; at most two
    List<String>? morePhotoIds,
    String? name,
    int? originalPriceVnd,
    String? photoId,
    int? priceVnd,
    String? unit,
    int? units,
    int? weightGrams,
    DateTime? windowEnd,
    DateTime? windowStart,
  }) = _OfferChangeBody;

  factory OfferChangeBody.fromJson(Map<String, Object?> json) =>
      _$OfferChangeBodyFromJson(json);
}
