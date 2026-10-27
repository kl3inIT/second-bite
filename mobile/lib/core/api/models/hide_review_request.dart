// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'hide_review_request.freezed.dart';
part 'hide_review_request.g.dart';

@Freezed()
abstract class HideReviewRequest with _$HideReviewRequest {
  const factory HideReviewRequest({
    /// Why it is hidden, at most 500 characters
    String? reason,
  }) = _HideReviewRequest;

  factory HideReviewRequest.fromJson(Map<String, Object?> json) =>
      _$HideReviewRequestFromJson(json);
}
