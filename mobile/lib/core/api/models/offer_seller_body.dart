// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'offer_photo_body.dart';

part 'offer_seller_body.freezed.dart';
part 'offer_seller_body.g.dart';

@Freezed()
abstract class OfferSellerBody with _$OfferSellerBody {
  const factory OfferSellerBody({
    required String address,
    required String id,
    required String name,
    OfferPhotoBody? photo,
  }) = _OfferSellerBody;

  factory OfferSellerBody.fromJson(Map<String, Object?> json) =>
      _$OfferSellerBodyFromJson(json);
}
