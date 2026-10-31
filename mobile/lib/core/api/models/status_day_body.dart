// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'status_day_body.freezed.dart';
part 'status_day_body.g.dart';

@Freezed()
abstract class StatusDayBody with _$StatusDayBody {
  const factory StatusDayBody({
    required int active,
    required int blocked,

    /// The day in Vietnam, as YYYY-MM-DD
    required DateTime day,
    required int deleted,
    required int pending,
    required int rejected,
  }) = _StatusDayBody;

  factory StatusDayBody.fromJson(Map<String, Object?> json) =>
      _$StatusDayBodyFromJson(json);
}
