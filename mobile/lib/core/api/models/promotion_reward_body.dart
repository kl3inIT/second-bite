// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_reward_body_type.dart';

part 'promotion_reward_body.freezed.dart';
part 'promotion_reward_body.g.dart';

@Freezed()
abstract class PromotionRewardBody with _$PromotionRewardBody {
  const factory PromotionRewardBody({
    required PromotionRewardBodyType type,

    /// VND for fixed, 1 to 100 for percentage
    required int value,

    /// The most a percentage takes off, in VND; required with a percentage
    int? maxVnd,
  }) = _PromotionRewardBody;

  factory PromotionRewardBody.fromJson(Map<String, Object?> json) =>
      _$PromotionRewardBodyFromJson(json);
}
