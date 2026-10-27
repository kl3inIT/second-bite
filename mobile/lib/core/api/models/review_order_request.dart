// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'review_order_request_tags.dart';

part 'review_order_request.freezed.dart';
part 'review_order_request.g.dart';

@Freezed()
abstract class ReviewOrderRequest with _$ReviewOrderRequest {
  const factory ReviewOrderRequest({
    required int stars,

    /// What went well
    required List<ReviewOrderRequestTags> tags,
    String? comment,
  }) = _ReviewOrderRequest;

  factory ReviewOrderRequest.fromJson(Map<String, Object?> json) =>
      _$ReviewOrderRequestFromJson(json);
}
