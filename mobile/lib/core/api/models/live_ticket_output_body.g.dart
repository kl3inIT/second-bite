// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'live_ticket_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LiveTicketOutputBody _$LiveTicketOutputBodyFromJson(
  Map<String, dynamic> json,
) => _LiveTicketOutputBody(
  expiresAt: DateTime.parse(json['expiresAt'] as String),
  ticket: json['ticket'] as String,
);

Map<String, dynamic> _$LiveTicketOutputBodyToJson(
  _LiveTicketOutputBody instance,
) => <String, dynamic>{
  'expiresAt': instance.expiresAt.toIso8601String(),
  'ticket': instance.ticket,
};
