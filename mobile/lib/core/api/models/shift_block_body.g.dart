// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shift_block_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ShiftBlockBody _$ShiftBlockBodyFromJson(Map<String, dynamic> json) =>
    _ShiftBlockBody(
      from: json['from'] as String,
      name: json['name'] as String,
      orders: (json['orders'] as List<dynamic>)
          .map((e) => ShiftOrderBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      summary: ShiftSummaryBody.fromJson(
        json['summary'] as Map<String, dynamic>,
      ),
      until: json['until'] as String,
    );

Map<String, dynamic> _$ShiftBlockBodyToJson(_ShiftBlockBody instance) =>
    <String, dynamic>{
      'from': instance.from,
      'name': instance.name,
      'orders': instance.orders,
      'summary': instance.summary,
      'until': instance.until,
    };
