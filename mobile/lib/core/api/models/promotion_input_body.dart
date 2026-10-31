// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_rule_body.dart';

part 'promotion_input_body.freezed.dart';
part 'promotion_input_body.g.dart';

@Freezed()
abstract class PromotionInputBody with _$PromotionInputBody {
  const factory PromotionInputBody({
    /// Runs for every seller; otherwise for sellerIds
    required bool allSellers,

    /// Bounds the discounts of its orders still to collect and handed over
    required int budgetVnd,

    /// false pauses it
    required bool enabled,

    /// After startsAt
    required DateTime endsAt,
    required String name,

    /// Discounts one phone number takes in a day, Vietnam time; 0 for no limit
    required int perPhonePerDay,

    /// Each an alternative; an order takes the one taking the most off
    required List<PromotionRuleBody> rules,
    required DateTime startsAt,
    List<String>? sellerIds,
  }) = _PromotionInputBody;

  factory PromotionInputBody.fromJson(Map<String, Object?> json) =>
      _$PromotionInputBodyFromJson(json);
}
