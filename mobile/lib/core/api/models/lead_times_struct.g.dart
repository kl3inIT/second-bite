// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lead_times_struct.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LeadTimesStruct _$LeadTimesStructFromJson(Map<String, dynamic> json) =>
    _LeadTimesStruct(
      overThreeHours: (json['overThreeHours'] as num).toInt(),
      underHalfHour: (json['underHalfHour'] as num).toInt(),
      underHour: (json['underHour'] as num).toInt(),
      underThreeHours: (json['underThreeHours'] as num).toInt(),
    );

Map<String, dynamic> _$LeadTimesStructToJson(_LeadTimesStruct instance) =>
    <String, dynamic>{
      'overThreeHours': instance.overThreeHours,
      'underHalfHour': instance.underHalfHour,
      'underHour': instance.underHour,
      'underThreeHours': instance.underThreeHours,
    };
