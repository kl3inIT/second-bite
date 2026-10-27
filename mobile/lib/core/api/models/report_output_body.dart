// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'counts_body.dart';
import 'report_day_body.dart';
import 'report_store_body.dart';
import 'report_store_day_body.dart';

part 'report_output_body.freezed.dart';
part 'report_output_body.g.dart';

@Freezed()
abstract class ReportOutputBody with _$ReportOutputBody {
  const factory ReportOutputBody({
    /// Every day of the range, in order
    required List<ReportDayBody>? days,
    required DateTime since,

    /// Each store on each day it has numbers, by day then name
    required List<ReportStoreDayBody>? storeDays,

    /// Each store with numbers in the range, the most orders first
    required List<ReportStoreBody>? stores,
    required CountsBody totals,
    required DateTime until,
  }) = _ReportOutputBody;

  factory ReportOutputBody.fromJson(Map<String, Object?> json) =>
      _$ReportOutputBodyFromJson(json);
}
