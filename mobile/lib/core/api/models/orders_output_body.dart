// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_body.dart';

part 'orders_output_body.freezed.dart';
part 'orders_output_body.g.dart';

@Freezed()
abstract class OrdersOutputBody with _$OrdersOutputBody {
  const factory OrdersOutputBody({required List<OrderBody> orders}) =
      _OrdersOutputBody;

  factory OrdersOutputBody.fromJson(Map<String, Object?> json) =>
      _$OrdersOutputBodyFromJson(json);
}
