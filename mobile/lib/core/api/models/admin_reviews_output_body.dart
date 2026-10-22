// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'admin_review_body.dart';
import 'review_counts_body.dart';

part 'admin_reviews_output_body.freezed.dart';
part 'admin_reviews_output_body.g.dart';

@Freezed()
abstract class AdminReviewsOutputBody with _$AdminReviewsOutputBody {
  const factory AdminReviewsOutputBody({
    /// Reviews of each number of stars matching the other filters, whatever stars asks
    required ReviewCountsBody counts,
    required List<AdminReviewBody> items,
    required int page,
    required int pageSize,
    required int total,
    /// The mean stars of the shown reviews matching every filter; absent when none does
    double? average,
  }) = _AdminReviewsOutputBody;

  factory AdminReviewsOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminReviewsOutputBodyFromJson(json);
}
