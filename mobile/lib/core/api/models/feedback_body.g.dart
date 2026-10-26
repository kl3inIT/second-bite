// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_FeedbackBody _$FeedbackBodyFromJson(Map<String, dynamic> json) =>
    _FeedbackBody(
      id: json['id'] as String,
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      sentAt: DateTime.parse(json['sentAt'] as String),
      text: json['text'] as String,
    );

Map<String, dynamic> _$FeedbackBodyToJson(_FeedbackBody instance) =>
    <String, dynamic>{
      'id': instance.id,
      'sellerId': instance.sellerId,
      'sellerName': instance.sellerName,
      'sentAt': instance.sentAt.toIso8601String(),
      'text': instance.text,
    };
