// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_running_promotions_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ListRunningPromotionsResponse _$ListRunningPromotionsResponseFromJson(
  Map<String, dynamic> json,
) => _ListRunningPromotionsResponse(
  promotions: (json['promotions'] as List<dynamic>)
      .map((e) => RunningPromotionBody.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$ListRunningPromotionsResponseToJson(
  _ListRunningPromotionsResponse instance,
) => <String, dynamic>{'promotions': instance.promotions};
