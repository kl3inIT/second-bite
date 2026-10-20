// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'day_count_body.dart';
import 'latest_offer_body.dart';
import 'top_seller_body.dart';

part 'offers_summary_body.freezed.dart';
part 'offers_summary_body.g.dart';

@Freezed()
abstract class OffersSummaryBody with _$OffersSummaryBody {
  const factory OffersSummaryBody({
    /// The five offers posted last, newest first, whenever that was
    required List<LatestOfferBody> latest,

    /// Offers customers can order now; a blocked seller's are left out
    required int onSaleNow,

    /// Offers posted in the range, whatever became of them
    required int postedInRange,

    /// Offers posted on every day of the range, in order
    required List<DayCountBody> postedPerDay,

    /// Offers customers see sold out now; a blocked seller's are left out
    required int soldOutNow,

    /// The five sellers that posted most in the range
    required List<TopSellerBody> topSellers,

    /// The units those offers put up
    required int unitsPostedInRange,
  }) = _OffersSummaryBody;

  factory OffersSummaryBody.fromJson(Map<String, Object?> json) =>
      _$OffersSummaryBodyFromJson(json);
}
