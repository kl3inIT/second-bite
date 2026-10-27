// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReviewCountsBody _$ReviewCountsBodyFromJson(Map<String, dynamic> json) =>
    _ReviewCountsBody(
      fiveStars: (json['fiveStars'] as num).toInt(),
      fourStars: (json['fourStars'] as num).toInt(),
      hidden: (json['hidden'] as num).toInt(),
      oneStar: (json['oneStar'] as num).toInt(),
      threeStars: (json['threeStars'] as num).toInt(),
      twoStars: (json['twoStars'] as num).toInt(),
    );

Map<String, dynamic> _$ReviewCountsBodyToJson(_ReviewCountsBody instance) =>
    <String, dynamic>{
      'fiveStars': instance.fiveStars,
      'fourStars': instance.fourStars,
      'hidden': instance.hidden,
      'oneStar': instance.oneStar,
      'threeStars': instance.threeStars,
      'twoStars': instance.twoStars,
    };
