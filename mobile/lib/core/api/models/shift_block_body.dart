// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'shift_order_body.dart';
import 'shift_summary_body.dart';

part 'shift_block_body.freezed.dart';
part 'shift_block_body.g.dart';

@Freezed()
abstract class ShiftBlockBody with _$ShiftBlockBody {
  const factory ShiftBlockBody({
    /// HH:MM
    required String from,
    required String name,

    /// By window, then number
    required List<ShiftOrderBody> orders,
    required ShiftSummaryBody summary,

    /// HH:MM, 24:00 ending at midnight
    required String until,
  }) = _ShiftBlockBody;

  factory ShiftBlockBody.fromJson(Map<String, Object?> json) =>
      _$ShiftBlockBodyFromJson(json);
}
