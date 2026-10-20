// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'day_count_body.freezed.dart';
part 'day_count_body.g.dart';

@Freezed()
abstract class DayCountBody with _$DayCountBody {
  const factory DayCountBody({
    required int count,

    /// A day in Vietnam time
    required DateTime date,
  }) = _DayCountBody;

  factory DayCountBody.fromJson(Map<String, Object?> json) =>
      _$DayCountBodyFromJson(json);
}
