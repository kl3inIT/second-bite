// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_FeedbackOutputBody _$FeedbackOutputBodyFromJson(Map<String, dynamic> json) =>
    _FeedbackOutputBody(
      items: (json['items'] as List<dynamic>)
          .map((e) => FeedbackBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$FeedbackOutputBodyToJson(_FeedbackOutputBody instance) =>
    <String, dynamic>{'items': instance.items};
