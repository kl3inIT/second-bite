// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'star_counts_body.freezed.dart';
part 'star_counts_body.g.dart';

@Freezed()
abstract class StarCountsBody with _$StarCountsBody {
  const factory StarCountsBody({
    required int fiveStars,
    required int fourStars,
    required int oneStar,
    required int threeStars,
    required int twoStars,
  }) = _StarCountsBody;

  factory StarCountsBody.fromJson(Map<String, Object?> json) =>
      _$StarCountsBodyFromJson(json);
}
