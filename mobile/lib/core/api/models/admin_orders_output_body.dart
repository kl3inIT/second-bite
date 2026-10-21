// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_body.dart';
import 'order_counts_body.dart';

part 'admin_orders_output_body.freezed.dart';
part 'admin_orders_output_body.g.dart';

@Freezed()
abstract class AdminOrdersOutputBody with _$AdminOrdersOutputBody {
  const factory AdminOrdersOutputBody({
    /// Orders of each status matching the other filters, whatever status asks
    required OrderCountsBody counts,
    required List<OrderBody> items,
    required int page,
    required int pageSize,
    required int total,
  }) = _AdminOrdersOutputBody;

  factory AdminOrdersOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminOrdersOutputBodyFromJson(json);
}
