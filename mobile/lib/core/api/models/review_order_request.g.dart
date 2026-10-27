// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_order_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReviewOrderRequest _$ReviewOrderRequestFromJson(Map<String, dynamic> json) =>
    _ReviewOrderRequest(
      stars: (json['stars'] as num).toInt(),
      tags: (json['tags'] as List<dynamic>)
          .map((e) => ReviewOrderRequestTags.fromJson(e as String))
          .toList(),
      comment: json['comment'] as String?,
    );

Map<String, dynamic> _$ReviewOrderRequestToJson(_ReviewOrderRequest instance) =>
    <String, dynamic>{
      'stars': instance.stars,
      'tags': instance.tags
          .map((e) => _$ReviewOrderRequestTagsEnumMap[e]!)
          .toList(),
      'comment': instance.comment,
    };

const _$ReviewOrderRequestTagsEnumMap = {
  ReviewOrderRequestTags.fastPickup: 'fast_pickup',
  ReviewOrderRequestTags.goodQuality: 'good_quality',
  ReviewOrderRequestTags.goodVariety: 'good_variety',
  ReviewOrderRequestTags.fairPortions: 'fair_portions',
  ReviewOrderRequestTags.$unknown: r'$unknown',
};
