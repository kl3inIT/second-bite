// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_settings_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferSettingsBody _$OfferSettingsBodyFromJson(Map<String, dynamic> json) =>
    _OfferSettingsBody(
      defaultRadiusKm: (json['defaultRadiusKm'] as num).toInt(),
      maxRadiusKm: (json['maxRadiusKm'] as num).toInt(),
      minDiscountPercent: (json['minDiscountPercent'] as num).toInt(),
      startsWithinHours: (json['startsWithinHours'] as num).toInt(),
      windowMaxMinutes: (json['windowMaxMinutes'] as num).toInt(),
      windowMinMinutes: (json['windowMinMinutes'] as num).toInt(),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      updatedBy: json['updatedBy'] as String?,
    );

Map<String, dynamic> _$OfferSettingsBodyToJson(_OfferSettingsBody instance) =>
    <String, dynamic>{
      'defaultRadiusKm': instance.defaultRadiusKm,
      'maxRadiusKm': instance.maxRadiusKm,
      'minDiscountPercent': instance.minDiscountPercent,
      'startsWithinHours': instance.startsWithinHours,
      'windowMaxMinutes': instance.windowMaxMinutes,
      'windowMinMinutes': instance.windowMinMinutes,
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'updatedBy': instance.updatedBy,
    };
