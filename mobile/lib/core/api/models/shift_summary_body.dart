// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'shift_summary_body.freezed.dart';
part 'shift_summary_body.g.dart';

@Freezed()
abstract class ShiftSummaryBody with _$ShiftSummaryBody {
  const factory ShiftSummaryBody({
    /// Orders, however they ended
    required int orders,

    /// Stores with a post or an order
    required int stores,

    /// Portions handed over
    required int unitsCollected,

    /// Portions the store refused or whose window ended without a hand-over; an order cancelled by its customer is in neither
    required int unitsNotCollected,

    /// Portions of the offers posted for it, whatever became of them
    required int unitsPosted,
  }) = _ShiftSummaryBody;

  factory ShiftSummaryBody.fromJson(Map<String, Object?> json) =>
      _$ShiftSummaryBodyFromJson(json);
}
