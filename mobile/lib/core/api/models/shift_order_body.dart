// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'shift_order_body_status.dart';

part 'shift_order_body.freezed.dart';
part 'shift_order_body.g.dart';

@Freezed()
abstract class ShiftOrderBody with _$ShiftOrderBody {
  const factory ShiftOrderBody({
    required String customer,
    required String dishes,
    required int number,
    required DateTime orderedAt,
    required String phone,
    required ShiftOrderBodyStatus status,
    required String store,
    required int units,
    required DateTime windowEnd,
    required DateTime windowStart,
  }) = _ShiftOrderBody;

  factory ShiftOrderBody.fromJson(Map<String, Object?> json) =>
      _$ShiftOrderBodyFromJson(json);
}
