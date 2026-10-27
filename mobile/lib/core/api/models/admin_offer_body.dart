// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'offer_body.dart';

part 'admin_offer_body.freezed.dart';
part 'admin_offer_body.g.dart';

@Freezed()
abstract class AdminOfferBody with _$AdminOfferBody {
  const factory AdminOfferBody({
    required OfferBody offer,

    /// Copied from the seller when the offer was posted
    required String sellerName,
  }) = _AdminOfferBody;

  factory AdminOfferBody.fromJson(Map<String, Object?> json) =>
      _$AdminOfferBodyFromJson(json);
}
