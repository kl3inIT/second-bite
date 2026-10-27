// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderCountsBody _$OrderCountsBodyFromJson(Map<String, dynamic> json) =>
    _OrderCountsBody(
      cancelled: (json['cancelled'] as num).toInt(),
      collected: (json['collected'] as num).toInt(),
      confirmed: (json['confirmed'] as num).toInt(),
      expired: (json['expired'] as num).toInt(),
      ready: (json['ready'] as num).toInt(),
      refused: (json['refused'] as num).toInt(),
    );

Map<String, dynamic> _$OrderCountsBodyToJson(_OrderCountsBody instance) =>
    <String, dynamic>{
      'cancelled': instance.cancelled,
      'collected': instance.collected,
      'confirmed': instance.confirmed,
      'expired': instance.expired,
      'ready': instance.ready,
      'refused': instance.refused,
    };
