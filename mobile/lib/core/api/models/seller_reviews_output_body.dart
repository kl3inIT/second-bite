// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'seller_review_body.dart';
import 'star_counts_body.dart';

part 'seller_reviews_output_body.freezed.dart';
part 'seller_reviews_output_body.g.dart';

@Freezed()
abstract class SellerReviewsOutputBody with _$SellerReviewsOutputBody {
  const factory SellerReviewsOutputBody({
    /// Reviews of each number of stars, whatever stars asks
    required StarCountsBody counts,
    required List<SellerReviewBody> items,
    required int page,
    required int pageSize,

    /// Reviews of the stars asked
    required int total,

    /// The mean stars of the reviews of the stars asked; absent when none
    double? average,
  }) = _SellerReviewsOutputBody;

  factory SellerReviewsOutputBody.fromJson(Map<String, Object?> json) =>
      _$SellerReviewsOutputBodyFromJson(json);
}
