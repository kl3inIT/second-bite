// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_summary_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminSummaryBody _$AdminSummaryBodyFromJson(
  Map<String, dynamic> json,
) => _AdminSummaryBody(
  accounts: AccountsSummaryBody.fromJson(
    json['accounts'] as Map<String, dynamic>,
  ),
  from: DateTime.parse(json['from'] as String),
  offers: OffersSummaryBody.fromJson(json['offers'] as Map<String, dynamic>),
  sellers: SellersSummaryBody.fromJson(json['sellers'] as Map<String, dynamic>),
  to: DateTime.parse(json['to'] as String),
);

Map<String, dynamic> _$AdminSummaryBodyToJson(_AdminSummaryBody instance) =>
    <String, dynamic>{
      'accounts': instance.accounts,
      'from': instance.from.toIso8601String(),
      'offers': instance.offers,
      'sellers': instance.sellers,
      'to': instance.to.toIso8601String(),
    };
