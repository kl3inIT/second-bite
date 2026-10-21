// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_status_day.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellerStatusDay _$SellerStatusDayFromJson(Map<String, dynamic> json) =>
    _SellerStatusDay(
      active: (json['active'] as num).toInt(),
      blocked: (json['blocked'] as num).toInt(),
      date: DateTime.parse(json['date'] as String),
      pending: (json['pending'] as num).toInt(),
      rejected: (json['rejected'] as num).toInt(),
    );

Map<String, dynamic> _$SellerStatusDayToJson(_SellerStatusDay instance) =>
    <String, dynamic>{
      'active': instance.active,
      'blocked': instance.blocked,
      'date': instance.date.toIso8601String(),
      'pending': instance.pending,
      'rejected': instance.rejected,
    };
