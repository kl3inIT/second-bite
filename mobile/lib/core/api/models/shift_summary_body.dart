// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'shift_summary_body.freezed.dart';
part 'shift_summary_body.g.dart';

@Freezed()
abstract class ShiftSummaryBody with _$ShiftSummaryBody {
  const factory ShiftSummaryBody({
    required int orders,
    required int stores,
    required int unitsCollected,
    required int unitsNotCollected,
    required int unitsPosted,
  }) = _ShiftSummaryBody;

  factory ShiftSummaryBody.fromJson(Map<String, Object?> json) =>
      _$ShiftSummaryBodyFromJson(json);
}
