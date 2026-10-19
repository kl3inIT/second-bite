// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offers_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OffersOutputBody _$OffersOutputBodyFromJson(Map<String, dynamic> json) =>
    _OffersOutputBody(
      offers: (json['offers'] as List<dynamic>)
          .map((e) => OfferBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$OffersOutputBodyToJson(_OffersOutputBody instance) =>
    <String, dynamic>{'offers': instance.offers};
