// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_orders_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminOrdersOutputBody _$AdminOrdersOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminOrdersOutputBody(
  counts: OrderCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>)
      .map((e) => OrderBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$AdminOrdersOutputBodyToJson(
  _AdminOrdersOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
