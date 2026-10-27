// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'star_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_StarCountsBody _$StarCountsBodyFromJson(Map<String, dynamic> json) =>
    _StarCountsBody(
      fiveStars: (json['fiveStars'] as num).toInt(),
      fourStars: (json['fourStars'] as num).toInt(),
      oneStar: (json['oneStar'] as num).toInt(),
      threeStars: (json['threeStars'] as num).toInt(),
      twoStars: (json['twoStars'] as num).toInt(),
    );

Map<String, dynamic> _$StarCountsBodyToJson(_StarCountsBody instance) =>
    <String, dynamic>{
      'fiveStars': instance.fiveStars,
      'fourStars': instance.fourStars,
      'oneStar': instance.oneStar,
      'threeStars': instance.threeStars,
      'twoStars': instance.twoStars,
    };
