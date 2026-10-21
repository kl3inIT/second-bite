// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_MessageBody _$MessageBodyFromJson(Map<String, dynamic> json) => _MessageBody(
  from: MessageBodyFrom.fromJson(json['from'] as String),
  sentAt: DateTime.parse(json['sentAt'] as String),
  seq: (json['seq'] as num).toInt(),
  text: json['text'] as String,
);

Map<String, dynamic> _$MessageBodyToJson(_MessageBody instance) =>
    <String, dynamic>{
      'from': _$MessageBodyFromEnumMap[instance.from]!,
      'sentAt': instance.sentAt.toIso8601String(),
      'seq': instance.seq,
      'text': instance.text,
    };

const _$MessageBodyFromEnumMap = {
  MessageBodyFrom.customer: 'customer',
  MessageBodyFrom.seller: 'seller',
  MessageBodyFrom.$unknown: r'$unknown',
};
