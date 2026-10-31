// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_promotion_body.freezed.dart';
part 'order_promotion_body.g.dart';

@Freezed()
abstract class OrderPromotionBody with _$OrderPromotionBody {
  const factory OrderPromotionBody({
    required String id,

    /// The promotion's name when the order was placed
    required String name,

    /// The phone number had no order handed over when this one was placed
    required bool newCustomer,

    /// The rule's name when the order was placed
    required String rule,
  }) = _OrderPromotionBody;

  factory OrderPromotionBody.fromJson(Map<String, Object?> json) =>
      _$OrderPromotionBodyFromJson(json);
}
