// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'payout_body.freezed.dart';
part 'payout_body.g.dart';

@Freezed()
abstract class PayoutBody with _$PayoutBody {
  const factory PayoutBody({
    /// Discounts of its orders handed over in the week
    required int amountVnd,
    required int newCustomers,
    required int orders,
    required String sellerId,
    required String sellerName,

    /// When an admin marked the week paid; absent until then
    DateTime? paidAt,

    /// The amount marked paid then
    int? paidVnd,
  }) = _PayoutBody;

  factory PayoutBody.fromJson(Map<String, Object?> json) =>
      _$PayoutBodyFromJson(json);
}
