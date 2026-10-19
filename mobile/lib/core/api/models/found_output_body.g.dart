// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'found_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_FoundOutputBody _$FoundOutputBodyFromJson(Map<String, dynamic> json) =>
    _FoundOutputBody(
      offers: (json['offers'] as List<dynamic>)
          .map((e) => FoundBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$FoundOutputBodyToJson(_FoundOutputBody instance) =>
    <String, dynamic>{'offers': instance.offers};
