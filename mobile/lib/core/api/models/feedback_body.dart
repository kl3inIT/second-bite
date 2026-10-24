// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'feedback_body.freezed.dart';
part 'feedback_body.g.dart';

@Freezed()
abstract class FeedbackBody with _$FeedbackBody {
  const factory FeedbackBody({
    required String id,
    required String sellerId,
    required String sellerName,
    required DateTime sentAt,
    required String text,
  }) = _FeedbackBody;

  factory FeedbackBody.fromJson(Map<String, Object?> json) =>
      _$FeedbackBodyFromJson(json);
}
