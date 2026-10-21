// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'seller_status_day.freezed.dart';
part 'seller_status_day.g.dart';

@Freezed()
abstract class SellerStatusDay with _$SellerStatusDay {
  const factory SellerStatusDay({
    required int active,
    required int blocked,

    /// A day in Vietnam time
    required DateTime date,
    required int pending,
  }) = _SellerStatusDay;

  factory SellerStatusDay.fromJson(Map<String, Object?> json) =>
      _$SellerStatusDayFromJson(json);
}
