// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'promotion_counts_body.freezed.dart';
part 'promotion_counts_body.g.dart';

@Freezed()
abstract class PromotionCountsBody with _$PromotionCountsBody {
  const factory PromotionCountsBody({
    required int ended,
    required int paused,
    required int running,
    required int scheduled,
  }) = _PromotionCountsBody;

  factory PromotionCountsBody.fromJson(Map<String, Object?> json) =>
      _$PromotionCountsBodyFromJson(json);
}
