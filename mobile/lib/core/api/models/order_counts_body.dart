// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_counts_body.freezed.dart';
part 'order_counts_body.g.dart';

@Freezed()
abstract class OrderCountsBody with _$OrderCountsBody {
  const factory OrderCountsBody({
    required int cancelled,
    required int collected,
    required int confirmed,
    required int expired,
    required int ready,
    required int refused,
  }) = _OrderCountsBody;

  factory OrderCountsBody.fromJson(Map<String, Object?> json) =>
      _$OrderCountsBodyFromJson(json);
}
