// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sell_out_struct.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellOutStruct _$SellOutStructFromJson(Map<String, dynamic> json) =>
    _SellOutStruct(
      medianMinutes: (json['medianMinutes'] as num).toInt(),
      notSoldOut: (json['notSoldOut'] as num).toInt(),
      overTwoHours: (json['overTwoHours'] as num).toInt(),
      underHalfHour: (json['underHalfHour'] as num).toInt(),
      underHour: (json['underHour'] as num).toInt(),
      underTwoHours: (json['underTwoHours'] as num).toInt(),
    );

Map<String, dynamic> _$SellOutStructToJson(_SellOutStruct instance) =>
    <String, dynamic>{
      'medianMinutes': instance.medianMinutes,
      'notSoldOut': instance.notSoldOut,
      'overTwoHours': instance.overTwoHours,
      'underHalfHour': instance.underHalfHour,
      'underHour': instance.underHour,
      'underTwoHours': instance.underTwoHours,
    };
