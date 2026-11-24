// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift_order_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ShiftOrderBody _$ShiftOrderBodyFromJson(Map<String, dynamic> json) =>
    _ShiftOrderBody(
      customer: json['customer'] as String,
      dishes: json['dishes'] as String,
      number: (json['number'] as num).toInt(),
      orderedAt: DateTime.parse(json['orderedAt'] as String),
      phone: json['phone'] as String,
      status: ShiftOrderBodyStatus.fromJson(json['status'] as String),
      store: json['store'] as String,
      units: (json['units'] as num).toInt(),
      windowEnd: DateTime.parse(json['windowEnd'] as String),
      windowStart: DateTime.parse(json['windowStart'] as String),
    );

Map<String, dynamic> _$ShiftOrderBodyToJson(_ShiftOrderBody instance) =>
    <String, dynamic>{
      'customer': instance.customer,
      'dishes': instance.dishes,
      'number': instance.number,
      'orderedAt': instance.orderedAt.toIso8601String(),
      'phone': instance.phone,
      'status': _$ShiftOrderBodyStatusEnumMap[instance.status]!,
      'store': instance.store,
      'units': instance.units,
      'windowEnd': instance.windowEnd.toIso8601String(),
      'windowStart': instance.windowStart.toIso8601String(),
    };

const _$ShiftOrderBodyStatusEnumMap = {
  ShiftOrderBodyStatus.confirmed: 'confirmed',
  ShiftOrderBodyStatus.ready: 'ready',
  ShiftOrderBodyStatus.collected: 'collected',
  ShiftOrderBodyStatus.cancelled: 'cancelled',
  ShiftOrderBodyStatus.refused: 'refused',
  ShiftOrderBodyStatus.expired: 'expired',
  ShiftOrderBodyStatus.$unknown: r'$unknown',
};
