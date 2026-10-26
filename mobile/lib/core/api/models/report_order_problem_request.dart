// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'report_order_problem_request_kind.dart';

part 'report_order_problem_request.freezed.dart';
part 'report_order_problem_request.g.dart';

@Freezed()
abstract class ReportOrderProblemRequest with _$ReportOrderProblemRequest {
  const factory ReportOrderProblemRequest({
    required ReportOrderProblemRequestKind kind,

    /// Up to 500 characters, or ORDER_PROBLEM_INVALID
    String? note,
  }) = _ReportOrderProblemRequest;

  factory ReportOrderProblemRequest.fromJson(Map<String, Object?> json) =>
      _$ReportOrderProblemRequestFromJson(json);
}
