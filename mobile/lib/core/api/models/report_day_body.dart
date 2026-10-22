// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'counts_body.dart';

part 'report_day_body.freezed.dart';
part 'report_day_body.g.dart';

@Freezed()
abstract class ReportDayBody with _$ReportDayBody {
  const factory ReportDayBody({
    required CountsBody counts,
    required DateTime day,
  }) = _ReportDayBody;

  factory ReportDayBody.fromJson(Map<String, Object?> json) =>
      _$ReportDayBodyFromJson(json);
}
