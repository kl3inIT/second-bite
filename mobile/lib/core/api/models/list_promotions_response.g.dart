// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_promotions_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ListPromotionsResponse _$ListPromotionsResponseFromJson(
  Map<String, dynamic> json,
) => _ListPromotionsResponse(
  counts: PromotionCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>)
      .map((e) => PromotionBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
);

Map<String, dynamic> _$ListPromotionsResponseToJson(
  _ListPromotionsResponse instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
};
