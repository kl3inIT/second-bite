// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_sellers_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminSellersOutputBody _$AdminSellersOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminSellersOutputBody(
  counts: StatusCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => AdminSellerBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$AdminSellersOutputBodyToJson(
  _AdminSellersOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
