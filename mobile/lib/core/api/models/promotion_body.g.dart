// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promotion_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PromotionBody _$PromotionBodyFromJson(Map<String, dynamic> json) =>
    _PromotionBody(
      allSellers: json['allSellers'] as bool,
      budgetVnd: (json['budgetVnd'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      enabled: json['enabled'] as bool,
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
      startsAt: DateTime.parse(json['startsAt'] as String),
      status: PromotionBodyStatus.fromJson(json['status'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      use: PromotionUseBody.fromJson(json['use'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$PromotionBodyToJson(_PromotionBody instance) =>
    <String, dynamic>{
      'allSellers': instance.allSellers,
      'budgetVnd': instance.budgetVnd,
      'createdAt': instance.createdAt.toIso8601String(),
      'enabled': instance.enabled,
      'endsAt': instance.endsAt.toIso8601String(),
      'id': instance.id,
      'name': instance.name,
      'perPhonePerDay': instance.perPhonePerDay,
      'rules': instance.rules,
      'sellerIds': instance.sellerIds,
      'startsAt': instance.startsAt.toIso8601String(),
      'status': _$PromotionBodyStatusEnumMap[instance.status]!,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'use': instance.use,
    };

const _$PromotionBodyStatusEnumMap = {
  PromotionBodyStatus.running: 'running',
  PromotionBodyStatus.scheduled: 'scheduled',
  PromotionBodyStatus.paused: 'paused',
  PromotionBodyStatus.ended: 'ended',
  PromotionBodyStatus.$unknown: r'$unknown',
};
