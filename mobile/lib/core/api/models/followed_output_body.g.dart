// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'followed_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_FollowedOutputBody _$FollowedOutputBodyFromJson(Map<String, dynamic> json) =>
    _FollowedOutputBody(
      sellers: (json['sellers'] as List<dynamic>?)
          ?.map((e) => SellerProfileBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$FollowedOutputBodyToJson(_FollowedOutputBody instance) =>
    <String, dynamic>{'sellers': instance.sellers};
