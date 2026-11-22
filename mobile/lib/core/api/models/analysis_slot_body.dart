// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'analysis_slot_body.freezed.dart';
part 'analysis_slot_body.g.dart';

@Freezed()
abstract class AnalysisSlotBody with _$AnalysisSlotBody {
  const factory AnalysisSlotBody({
    required int collected,
    required int held,

    /// The hour of the window's start in Vietnam
    required int hour,

    /// 1 Monday to 7 Sunday, of the window's start in Vietnam
    required int weekday,
  }) = _AnalysisSlotBody;

  factory AnalysisSlotBody.fromJson(Map<String, Object?> json) =>
      _$AnalysisSlotBodyFromJson(json);
}
