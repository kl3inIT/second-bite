// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_seller_body.freezed.dart';
part 'order_seller_body.g.dart';

@Freezed()
abstract class OrderSellerBody with _$OrderSellerBody {
  const factory OrderSellerBody({
    required String address,
    required String id,
    required double latitude,
    required double longitude,
    required String name,
  }) = _OrderSellerBody;

  factory OrderSellerBody.fromJson(Map<String, Object?> json) =>
      _$OrderSellerBodyFromJson(json);
}
