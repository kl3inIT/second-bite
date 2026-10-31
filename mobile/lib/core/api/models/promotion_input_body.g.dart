// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionInputBody _$PromotionInputBodyFromJson(Map<String, dynamic> json) =>
    _PromotionInputBody(
      allSellers: json['allSellers'] as bool,
      budgetVnd: (json['budgetVnd'] as num).toInt(),
      enabled: json['enabled'] as bool,
      endsAt: DateTime.parse(json['endsAt'] as String),
      name: json['name'] as String,
      perPhonePerDay: (json['perPhonePerDay'] as num).toInt(),
      rules: (json['rules'] as List<dynamic>)
          .map((e) => PromotionRuleBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      startsAt: DateTime.parse(json['startsAt'] as String),
      sellerIds: (json['sellerIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
    );

Map<String, dynamic> _$PromotionInputBodyToJson(_PromotionInputBody instance) =>
    <String, dynamic>{
      'allSellers': instance.allSellers,
      'budgetVnd': instance.budgetVnd,
      'enabled': instance.enabled,
      'endsAt': instance.endsAt.toIso8601String(),
      'name': instance.name,
      'perPhonePerDay': instance.perPhonePerDay,
      'rules': instance.rules,
      'startsAt': instance.startsAt.toIso8601String(),
      'sellerIds': instance.sellerIds,
    };
