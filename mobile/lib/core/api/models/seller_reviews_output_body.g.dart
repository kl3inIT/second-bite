// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_reviews_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellerReviewsOutputBody _$SellerReviewsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _SellerReviewsOutputBody(
  counts: StarCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>)
      .map((e) => SellerReviewBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
  average: (json['average'] as num?)?.toDouble(),
);

Map<String, dynamic> _$SellerReviewsOutputBodyToJson(
  _SellerReviewsOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
  'average': instance.average,
};
