// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'messages_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MessagesOutputBody _$MessagesOutputBodyFromJson(Map<String, dynamic> json) =>
    _MessagesOutputBody(
      messages: (json['messages'] as List<dynamic>)
          .map((e) => MessageBody.fromJson(e as Map<String, dynamic>))
          .toList(),
      open: json['open'] as bool,
      seen: SeenBody.fromJson(json['seen'] as Map<String, dynamic>),
      closesAt: json['closesAt'] == null
          ? null
          : DateTime.parse(json['closesAt'] as String),
    );

Map<String, dynamic> _$MessagesOutputBodyToJson(_MessagesOutputBody instance) =>
    <String, dynamic>{
      'messages': instance.messages,
      'open': instance.open,
      'seen': instance.seen,
      'closesAt': instance.closesAt?.toIso8601String(),
    };
