// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'offer_counts_body.freezed.dart';
part 'offer_counts_body.g.dart';

@Freezed()
abstract class OfferCountsBody with _$OfferCountsBody {
  const factory OfferCountsBody({
    required int closed,
    required int onSale,
    required int soldOut,
    required int withdrawn,
  }) = _OfferCountsBody;

  factory OfferCountsBody.fromJson(Map<String, Object?> json) =>
      _$OfferCountsBodyFromJson(json);
}
