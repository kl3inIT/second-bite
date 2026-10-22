// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_offers_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminOffersOutputBody _$AdminOffersOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminOffersOutputBody(
  counts: OfferCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>)
      .map((e) => AdminOfferBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$AdminOffersOutputBodyToJson(
  _AdminOffersOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
