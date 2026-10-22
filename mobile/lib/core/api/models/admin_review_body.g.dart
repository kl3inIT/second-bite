// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_review_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AdminReviewBody _$AdminReviewBodyFromJson(Map<String, dynamic> json) =>
    _AdminReviewBody(
      createdAt: DateTime.parse(json['createdAt'] as String),
      customerName: json['customerName'] as String,
      orderId: json['orderId'] as String,
      orderNumber: json['orderNumber'] as String,
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      stars: (json['stars'] as num).toInt(),
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
      comment: json['comment'] as String?,
      hiddenAt: json['hiddenAt'] == null
          ? null
          : DateTime.parse(json['hiddenAt'] as String),
      hiddenReason: json['hiddenReason'] as String?,
    );

Map<String, dynamic> _$AdminReviewBodyToJson(_AdminReviewBody instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'customerName': instance.customerName,
      'orderId': instance.orderId,
      'orderNumber': instance.orderNumber,
      'sellerId': instance.sellerId,
      'sellerName': instance.sellerName,
      'stars': instance.stars,
      'tags': instance.tags,
      'comment': instance.comment,
      'hiddenAt': instance.hiddenAt?.toIso8601String(),
      'hiddenReason': instance.hiddenReason,
    };
