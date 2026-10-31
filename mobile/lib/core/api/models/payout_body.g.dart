// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payout_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_PayoutBody _$PayoutBodyFromJson(Map<String, dynamic> json) => _PayoutBody(
  amountVnd: (json['amountVnd'] as num).toInt(),
  newCustomers: (json['newCustomers'] as num).toInt(),
  orders: (json['orders'] as num).toInt(),
  sellerId: json['sellerId'] as String,
  sellerName: json['sellerName'] as String,
  paidAt: json['paidAt'] == null
      ? null
      : DateTime.parse(json['paidAt'] as String),
  paidVnd: (json['paidVnd'] as num?)?.toInt(),
);

Map<String, dynamic> _$PayoutBodyToJson(_PayoutBody instance) =>
    <String, dynamic>{
      'amountVnd': instance.amountVnd,
      'newCustomers': instance.newCustomers,
      'orders': instance.orders,
      'sellerId': instance.sellerId,
      'sellerName': instance.sellerName,
      'paidAt': instance.paidAt?.toIso8601String(),
      'paidVnd': instance.paidVnd,
    };
