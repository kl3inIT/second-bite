// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'history_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_HistoryOutputBody _$HistoryOutputBodyFromJson(Map<String, dynamic> json) =>
    _HistoryOutputBody(
      collected: (json['collected'] as num).toInt(),
      missed: (json['missed'] as num).toInt(),
      placed: (json['placed'] as num).toInt(),
      recent: (json['recent'] as List<dynamic>)
          .map((e) => OrderBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$HistoryOutputBodyToJson(_HistoryOutputBody instance) =>
    <String, dynamic>{
      'collected': instance.collected,
      'missed': instance.missed,
      'placed': instance.placed,
      'recent': instance.recent,
    };
