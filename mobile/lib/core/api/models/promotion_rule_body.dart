// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_condition_body.dart';
import 'promotion_reward_body.dart';

part 'promotion_rule_body.freezed.dart';
part 'promotion_rule_body.g.dart';

@Freezed()
abstract class PromotionRuleBody with _$PromotionRuleBody {
  const factory PromotionRuleBody({
    /// All must hold; none means every order
    required List<PromotionConditionBody> conditions,
    required String name,

    /// Taken off the order's dishes, never more than they cost
    required PromotionRewardBody reward,
  }) = _PromotionRuleBody;

  factory PromotionRuleBody.fromJson(Map<String, Object?> json) =>
      _$PromotionRuleBodyFromJson(json);
}
