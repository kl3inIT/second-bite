// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'counts_body.dart';

part 'report_store_body.freezed.dart';
part 'report_store_body.g.dart';

@Freezed()
abstract class ReportStoreBody with _$ReportStoreBody {
  const factory ReportStoreBody({
    required CountsBody counts,

    /// Days of the range the store has a post on, whatever became of it
    required int daysPosted,

    /// Days it posted at least 7 portions on, the support programme's full day
    required int fullDays,
    required String name,
    required String sellerId,
  }) = _ReportStoreBody;

  factory ReportStoreBody.fromJson(Map<String, Object?> json) =>
      _$ReportStoreBodyFromJson(json);
}
