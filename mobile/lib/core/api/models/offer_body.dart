// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'collection_point_body.dart';
import 'offer_body_kind.dart';
import 'offer_body_status.dart';
import 'offer_photo_body.dart';

part 'offer_body.freezed.dart';
part 'offer_body.g.dart';

@Freezed()
abstract class OfferBody with _$OfferBody {
  const factory OfferBody({
    /// Where the offer is collected, copied from the seller when it was posted
    required CollectionPointBody collectionPoint,
    required DateTime createdAt,
    required String description,
    required int discountPercent,
    required String id,
    required OfferBodyKind kind,
    required String name,
    required int originalPriceVnd,

    /// The cover, which lists and orders show
    required OfferPhotoBody photo,

    /// Every photo, the cover first
    required List<OfferPhotoBody> photos,
    required int priceVnd,
    required String sellerId,

    /// sold_out and closed are read from the units left and the window
    required OfferBodyStatus status,
    required String unit,
    required int units,
    required int unitsLeft,
    required DateTime updatedAt,
    required DateTime windowEnd,
    required DateTime windowStart,
    int? weightGrams,
    DateTime? withdrawnAt,
  }) = _OfferBody;

  factory OfferBody.fromJson(Map<String, Object?> json) =>
      _$OfferBodyFromJson(json);
}
