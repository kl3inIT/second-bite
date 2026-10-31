// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'running_promotion_body.dart';

part 'list_running_promotions_response.freezed.dart';
part 'list_running_promotions_response.g.dart';

@Freezed()
abstract class ListRunningPromotionsResponse
    with _$ListRunningPromotionsResponse {
  const factory ListRunningPromotionsResponse({
    required List<RunningPromotionBody> promotions,
  }) = _ListRunningPromotionsResponse;

  factory ListRunningPromotionsResponse.fromJson(Map<String, Object?> json) =>
      _$ListRunningPromotionsResponseFromJson(json);
}
