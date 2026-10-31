// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_body_status.dart';
import 'promotion_rule_body.dart';
import 'promotion_use_body.dart';

part 'promotion_body.freezed.dart';
part 'promotion_body.g.dart';

@Freezed()
abstract class PromotionBody with _$PromotionBody {
  const factory PromotionBody({
    required bool allSellers,
    required int budgetVnd,
    required DateTime createdAt,
    required bool enabled,
    required DateTime endsAt,
    required String id,
    required String name,
    required int perPhonePerDay,
    required List<PromotionRuleBody> rules,
    required List<String> sellerIds,
    required DateTime startsAt,

    /// Read from its times and whether it is enabled
    required PromotionBodyStatus status,
    required DateTime updatedAt,
    required PromotionUseBody use,
  }) = _PromotionBody;

  factory PromotionBody.fromJson(Map<String, Object?> json) =>
      _$PromotionBodyFromJson(json);
}
