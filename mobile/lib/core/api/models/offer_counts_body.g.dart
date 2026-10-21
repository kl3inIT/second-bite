// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'offer_counts_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OfferCountsBody _$OfferCountsBodyFromJson(Map<String, dynamic> json) =>
    _OfferCountsBody(
      closed: (json['closed'] as num).toInt(),
      onSale: (json['onSale'] as num).toInt(),
      soldOut: (json['soldOut'] as num).toInt(),
      withdrawn: (json['withdrawn'] as num).toInt(),
    );

Map<String, dynamic> _$OfferCountsBodyToJson(_OfferCountsBody instance) =>
    <String, dynamic>{
      'closed': instance.closed,
      'onSale': instance.onSale,
      'soldOut': instance.soldOut,
      'withdrawn': instance.withdrawn,
    };
