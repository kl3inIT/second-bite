// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift_summary_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ShiftSummaryBody _$ShiftSummaryBodyFromJson(Map<String, dynamic> json) =>
    _ShiftSummaryBody(
      orders: (json['orders'] as num).toInt(),
      stores: (json['stores'] as num).toInt(),
      unitsCollected: (json['unitsCollected'] as num).toInt(),
      unitsNotCollected: (json['unitsNotCollected'] as num).toInt(),
      unitsPosted: (json['unitsPosted'] as num).toInt(),
    );

Map<String, dynamic> _$ShiftSummaryBodyToJson(_ShiftSummaryBody instance) =>
    <String, dynamic>{
      'orders': instance.orders,
      'stores': instance.stores,
      'unitsCollected': instance.unitsCollected,
      'unitsNotCollected': instance.unitsNotCollected,
      'unitsPosted': instance.unitsPosted,
    };
