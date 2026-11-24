// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'shift_block_body.dart';
import 'shift_summary_body.dart';

part 'shift_day_body.freezed.dart';
part 'shift_day_body.g.dart';

@Freezed()
abstract class ShiftDayBody with _$ShiftDayBody {
  const factory ShiftDayBody({
    required DateTime day,
    required List<ShiftBlockBody> shifts,
    required ShiftSummaryBody summary,
  }) = _ShiftDayBody;

  factory ShiftDayBody.fromJson(Map<String, Object?> json) =>
      _$ShiftDayBodyFromJson(json);
}
