// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'status_counts_body.freezed.dart';
part 'status_counts_body.g.dart';

@Freezed()
abstract class StatusCountsBody with _$StatusCountsBody {
  const factory StatusCountsBody({
    required int active,
    required int blocked,
    required int pending,
    required int rejected,
  }) = _StatusCountsBody;

  factory StatusCountsBody.fromJson(Map<String, Object?> json) =>
      _$StatusCountsBodyFromJson(json);
}
