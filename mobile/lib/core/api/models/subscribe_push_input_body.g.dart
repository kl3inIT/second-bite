// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscribe_push_input_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SubscribePushInputBody _$SubscribePushInputBodyFromJson(
  Map<String, dynamic> json,
) => _SubscribePushInputBody(
  tickets: (json['tickets'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
);

Map<String, dynamic> _$SubscribePushInputBodyToJson(
  _SubscribePushInputBody instance,
) => <String, dynamic>{'tickets': instance.tickets};
