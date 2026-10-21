// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'admin_seller_body.dart';
import 'status_counts_body.dart';
import 'status_day_body.dart';

part 'admin_sellers_output_body.freezed.dart';
part 'admin_sellers_output_body.g.dart';

@Freezed()
abstract class AdminSellersOutputBody with _$AdminSellersOutputBody {
  const factory AdminSellersOutputBody({
    /// Sellers of each status matching q, whatever status asks
    required StatusCountsBody counts,

    /// Sellers of each status on each of the last 14 days in Vietnam, the oldest first, whatever the filters; a day before counting started is absent
    required List<StatusDayBody>? days,
    required List<AdminSellerBody>? items,
    required int page,
    required int pageSize,
    required int total,
  }) = _AdminSellersOutputBody;

  factory AdminSellersOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminSellersOutputBodyFromJson(json);
}
