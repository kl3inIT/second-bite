// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'latest_offer_body.freezed.dart';
part 'latest_offer_body.g.dart';

@Freezed()
abstract class LatestOfferBody with _$LatestOfferBody {
  const factory LatestOfferBody({
    required String id,
    required String name,
    required DateTime postedAt,
    required String sellerId,

    /// As the offer copied it when posted
    required String sellerName,
  }) = _LatestOfferBody;

  factory LatestOfferBody.fromJson(Map<String, Object?> json) =>
      _$LatestOfferBodyFromJson(json);
}
