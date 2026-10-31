// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'promotion_condition_body_attribute.dart';
import 'promotion_condition_body_operator_enum.dart';

part 'promotion_condition_body.freezed.dart';
part 'promotion_condition_body.g.dart';

@Freezed()
abstract class PromotionConditionBody with _$PromotionConditionBody {
  const factory PromotionConditionBody({
    required PromotionConditionBodyAttribute attribute,

    /// eq for customer; in or not_in for seller; gte or lt for subtotal.
    /// The name has been replaced because it contains a keyword. Original name: `operator`.
    @JsonKey(name: 'operator')
    required PromotionConditionBodyOperatorEnum operatorEnum,

    /// new or returning for customer; seller identifiers; one amount in VND for subtotal
    required List<String> values,
  }) = _PromotionConditionBody;

  factory PromotionConditionBody.fromJson(Map<String, Object?> json) =>
      _$PromotionConditionBodyFromJson(json);
}
