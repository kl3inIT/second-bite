// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'send_seller_feedback_request.freezed.dart';
part 'send_seller_feedback_request.g.dart';

@Freezed()
abstract class SendSellerFeedbackRequest with _$SendSellerFeedbackRequest {
  const factory SendSellerFeedbackRequest({
    /// 1 to 1,000 characters, or SELLER_FEEDBACK_INVALID
    required String text,
  }) = _SendSellerFeedbackRequest;

  factory SendSellerFeedbackRequest.fromJson(Map<String, Object?> json) =>
      _$SendSellerFeedbackRequestFromJson(json);
}
