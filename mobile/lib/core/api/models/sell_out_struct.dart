// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'sell_out_struct.freezed.dart';
part 'sell_out_struct.g.dart';

@Freezed()
abstract class SellOutStruct with _$SellOutStruct {
  const factory SellOutStruct({
    /// The middle time to sell out; 0 when none did
    required int medianMinutes,

    /// Posts that ended with units left
    required int notSoldOut,
    required int overTwoHours,
    required int underHalfHour,
    required int underHour,
    required int underTwoHours,
  }) = _SellOutStruct;

  factory SellOutStruct.fromJson(Map<String, Object?> json) =>
      _$SellOutStructFromJson(json);
}
