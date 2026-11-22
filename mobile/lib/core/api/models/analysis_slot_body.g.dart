// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_slot_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AnalysisSlotBody _$AnalysisSlotBodyFromJson(Map<String, dynamic> json) =>
    _AnalysisSlotBody(
      collected: (json['collected'] as num).toInt(),
      held: (json['held'] as num).toInt(),
      hour: (json['hour'] as num).toInt(),
      weekday: (json['weekday'] as num).toInt(),
    );

Map<String, dynamic> _$AnalysisSlotBodyToJson(_AnalysisSlotBody instance) =>
    <String, dynamic>{
      'collected': instance.collected,
      'held': instance.held,
      'hour': instance.hour,
      'weekday': instance.weekday,
    };
