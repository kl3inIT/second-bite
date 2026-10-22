// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'counts_body.dart';

part 'report_store_day_body.freezed.dart';
part 'report_store_day_body.g.dart';

@Freezed()
abstract class ReportStoreDayBody with _$ReportStoreDayBody {
  const factory ReportStoreDayBody({
    required CountsBody counts,
    required DateTime day,
    required String name,
    required String sellerId,
  }) = _ReportStoreDayBody;

  factory ReportStoreDayBody.fromJson(Map<String, Object?> json) =>
      _$ReportStoreDayBodyFromJson(json);
}
