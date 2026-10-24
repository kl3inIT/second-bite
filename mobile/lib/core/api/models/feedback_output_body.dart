// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'feedback_body.dart';

part 'feedback_output_body.freezed.dart';
part 'feedback_output_body.g.dart';

@Freezed()
abstract class FeedbackOutputBody with _$FeedbackOutputBody {
  const factory FeedbackOutputBody({required List<FeedbackBody> items}) =
      _FeedbackOutputBody;

  factory FeedbackOutputBody.fromJson(Map<String, Object?> json) =>
      _$FeedbackOutputBodyFromJson(json);
}
