// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sellers_summary_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellersSummaryBody _$SellersSummaryBodyFromJson(Map<String, dynamic> json) =>
    _SellersSummaryBody(
      active: (json['active'] as num).toInt(),
      blocked: (json['blocked'] as num).toInt(),
      latest: (json['latest'] as List<dynamic>)
          .map((e) => OpenedSellerBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      openedInRange: (json['openedInRange'] as num).toInt(),
      pending: (json['pending'] as num).toInt(),
      perDay: (json['perDay'] as List<dynamic>)
          .map((e) => SellerStatusDay.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$SellersSummaryBodyToJson(_SellersSummaryBody instance) =>
    <String, dynamic>{
      'active': instance.active,
      'blocked': instance.blocked,
      'latest': instance.latest,
      'openedInRange': instance.openedInRange,
      'pending': instance.pending,
      'perDay': instance.perDay,
    };
