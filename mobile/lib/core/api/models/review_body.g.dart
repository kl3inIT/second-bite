// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ReviewBody _$ReviewBodyFromJson(Map<String, dynamic> json) => _ReviewBody(
  createdAt: DateTime.parse(json['createdAt'] as String),
  stars: (json['stars'] as num).toInt(),
  tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
  comment: json['comment'] as String?,
);

Map<String, dynamic> _$ReviewBodyToJson(_ReviewBody instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'stars': instance.stars,
      'tags': instance.tags,
      'comment': instance.comment,
    };
