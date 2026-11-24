// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'shift_day_body.dart';
import 'shift_summary_body.dart';

part 'shift_report_output_body.freezed.dart';
part 'shift_report_output_body.g.dart';

@Freezed()
abstract class ShiftReportOutputBody with _$ShiftReportOutputBody {
  const factory ShiftReportOutputBody({
    /// Every day of the range, in order
    required List<ShiftDayBody> days,
    required DateTime since,

    /// The whole range
    required ShiftSummaryBody totals,
    required DateTime until,
  }) = _ShiftReportOutputBody;

  factory ShiftReportOutputBody.fromJson(Map<String, Object?> json) =>
      _$ShiftReportOutputBodyFromJson(json);
}
