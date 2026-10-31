// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_body.dart';
import 'promotion_counts_body.dart';

part 'list_promotions_response.freezed.dart';
part 'list_promotions_response.g.dart';

@Freezed()
abstract class ListPromotionsResponse with _$ListPromotionsResponse {
  const factory ListPromotionsResponse({
    required PromotionCountsBody counts,
    required List<PromotionBody> items,
    required int page,
    required int pageSize,
    required int total,
  }) = _ListPromotionsResponse;

  factory ListPromotionsResponse.fromJson(Map<String, Object?> json) =>
      _$ListPromotionsResponseFromJson(json);
}
