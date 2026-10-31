// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'running_promotion_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RunningPromotionBody _$RunningPromotionBodyFromJson(
  Map<String, dynamic> json,
) => _RunningPromotionBody(
  allSellers: json['allSellers'] as bool,
  endsAt: DateTime.parse(json['endsAt'] as String),
  id: json['id'] as String,
  name: json['name'] as String,
  perPhonePerDay: (json['perPhonePerDay'] as num).toInt(),
  rules: (json['rules'] as List<dynamic>)
      .map((e) => PromotionRuleBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  sellerIds: (json['sellerIds'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
);

Map<String, dynamic> _$RunningPromotionBodyToJson(
  _RunningPromotionBody instance,
) => <String, dynamic>{
  'allSellers': instance.allSellers,
  'endsAt': instance.endsAt.toIso8601String(),
  'id': instance.id,
  'name': instance.name,
  'perPhonePerDay': instance.perPhonePerDay,
  'rules': instance.rules,
  'sellerIds': instance.sellerIds,
};
