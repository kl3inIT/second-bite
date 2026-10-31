// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_rule_body.dart';

part 'running_promotion_body.freezed.dart';
part 'running_promotion_body.g.dart';

@Freezed()
abstract class RunningPromotionBody with _$RunningPromotionBody {
  const factory RunningPromotionBody({
    required bool allSellers,
    required DateTime endsAt,
    required String id,
    required String name,

    /// 0 for no limit
    required int perPhonePerDay,
    required List<PromotionRuleBody> rules,
    required List<String> sellerIds,
  }) = _RunningPromotionBody;

  factory RunningPromotionBody.fromJson(Map<String, Object?> json) =>
      _$RunningPromotionBodyFromJson(json);
}
