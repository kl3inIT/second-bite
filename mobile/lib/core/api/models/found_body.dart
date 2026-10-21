// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'collection_point_body.dart';
import 'found_body_kind.dart';
import 'found_body_status.dart';
import 'offer_photo_body.dart';
import 'offer_seller_body.dart';

part 'found_body.freezed.dart';
part 'found_body.g.dart';

@Freezed()
abstract class FoundBody with _$FoundBody {
  const factory FoundBody({
    /// Where the offer is collected, copied from the seller when it was posted
    required CollectionPointBody collectionPoint,
    required DateTime createdAt,
    required String description,
    required int discountPercent,
    required String id,
    required FoundBodyKind kind,
    required String name,
    required int originalPriceVnd,

    /// The cover, which lists and orders show
    required OfferPhotoBody photo,

    /// Every photo, the cover first
    required List<OfferPhotoBody> photos,
    required int priceVnd,
    required OfferSellerBody seller,
    required String sellerId,

    /// sold_out and closed are read from the units left and the window
    required FoundBodyStatus status,
    required String unit,
    required int units,
    required int unitsLeft,
    required DateTime updatedAt,
    required DateTime windowEnd,
    required DateTime windowStart,

    /// From the point searched near; absent without one
    double? distanceMeters,
    int? weightGrams,
    DateTime? withdrawnAt,
  }) = _FoundBody;

  factory FoundBody.fromJson(Map<String, Object?> json) =>
      _$FoundBodyFromJson(json);
}
