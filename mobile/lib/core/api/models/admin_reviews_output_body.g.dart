// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_reviews_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminReviewsOutputBody _$AdminReviewsOutputBodyFromJson(
  Map<String, dynamic> json,
) => _AdminReviewsOutputBody(
  counts: ReviewCountsBody.fromJson(json['counts'] as Map<String, dynamic>),
  items: (json['items'] as List<dynamic>)
      .map((e) => AdminReviewBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  page: (json['page'] as num).toInt(),
  pageSize: (json['pageSize'] as num).toInt(),
  total: (json['total'] as num).toInt(),
  average: (json['average'] as num?)?.toDouble(),
);

Map<String, dynamic> _$AdminReviewsOutputBodyToJson(
  _AdminReviewsOutputBody instance,
) => <String, dynamic>{
  'counts': instance.counts,
  'items': instance.items,
  'page': instance.page,
  'pageSize': instance.pageSize,
  'total': instance.total,
  'average': instance.average,
};
