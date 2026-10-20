// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'day_count_body.dart';

part 'accounts_summary_body.freezed.dart';
part 'accounts_summary_body.g.dart';

@Freezed()
abstract class AccountsSummaryBody with _$AccountsSummaryBody {
  const factory AccountsSummaryBody({
    /// Accounts created in the range that still exist
    required int newInRange,

    /// Accounts created on every day of the range, in order
    required List<DayCountBody> newPerDay,

    /// Every account now, admins included
    required int total,
  }) = _AccountsSummaryBody;

  factory AccountsSummaryBody.fromJson(Map<String, Object?> json) =>
      _$AccountsSummaryBodyFromJson(json);
}
