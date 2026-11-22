// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'lead_times_struct.freezed.dart';
part 'lead_times_struct.g.dart';

@Freezed()
abstract class LeadTimesStruct with _$LeadTimesStruct {
  const factory LeadTimesStruct({
    required int overThreeHours,
    required int underHalfHour,
    required int underHour,
    required int underThreeHours,
  }) = _LeadTimesStruct;

  factory LeadTimesStruct.fromJson(Map<String, Object?> json) =>
      _$LeadTimesStructFromJson(json);
}
