// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'review_counts_body.freezed.dart';
part 'review_counts_body.g.dart';

@Freezed()
abstract class ReviewCountsBody with _$ReviewCountsBody {
  const factory ReviewCountsBody({
    required int fiveStars,
    required int fourStars,

    /// Hidden reviews of the stars asked, whatever visibility asks
    required int hidden,
    required int oneStar,
    required int threeStars,
    required int twoStars,
  }) = _ReviewCountsBody;

  factory ReviewCountsBody.fromJson(Map<String, Object?> json) =>
      _$ReviewCountsBodyFromJson(json);
}
