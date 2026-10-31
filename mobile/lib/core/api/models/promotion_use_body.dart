// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'promotion_use_body.freezed.dart';
part 'promotion_use_body.g.dart';

@Freezed()
abstract class PromotionUseBody with _$PromotionUseBody {
  const factory PromotionUseBody({
    /// Discounts of the orders still to collect; given back when they are cancelled, refused or expire
    required int heldVnd,

    /// budgetVnd less spentVnd and heldVnd
    required int leftVnd,

    /// Of those, the orders of a new customer
    required int newCustomers,

    /// Orders still to collect or handed over that took a discount
    required int orders,

    /// Sellers whose orders took a discount
    required int sellers,

    /// Discounts of the orders handed over
    required int spentVnd,
  }) = _PromotionUseBody;

  factory PromotionUseBody.fromJson(Map<String, Object?> json) =>
      _$PromotionUseBodyFromJson(json);
}
