// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'answer_order_problem_request.freezed.dart';
part 'answer_order_problem_request.g.dart';

@Freezed()
abstract class AnswerOrderProblemRequest with _$AnswerOrderProblemRequest {
  const factory AnswerOrderProblemRequest({
    /// 1 to 500 characters, or ORDER_ANSWER_INVALID
    required String answer,
  }) = _AnswerOrderProblemRequest;

  factory AnswerOrderProblemRequest.fromJson(Map<String, Object?> json) =>
      _$AnswerOrderProblemRequestFromJson(json);
}
