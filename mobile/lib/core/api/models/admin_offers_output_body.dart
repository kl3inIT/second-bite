// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'admin_offer_body.dart';
import 'offer_counts_body.dart';

part 'admin_offers_output_body.freezed.dart';
part 'admin_offers_output_body.g.dart';

@Freezed()
abstract class AdminOffersOutputBody with _$AdminOffersOutputBody {
  const factory AdminOffersOutputBody({
    /// Offers of each status matching the other filters, whatever status asks
    required OfferCountsBody counts,
    required List<AdminOfferBody> items,
    required int page,
    required int pageSize,
    required int total,
  }) = _AdminOffersOutputBody;

  factory AdminOffersOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminOffersOutputBodyFromJson(json);
}
