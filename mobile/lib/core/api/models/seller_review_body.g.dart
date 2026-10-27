// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seller_review_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SellerReviewBody _$SellerReviewBodyFromJson(Map<String, dynamic> json) =>
    _SellerReviewBody(
      createdAt: DateTime.parse(json['createdAt'] as String),
      customerName: json['customerName'] as String,
      orderId: json['orderId'] as String,
      orderNumber: json['orderNumber'] as String,
      stars: (json['stars'] as num).toInt(),
      tags: (json['tags'] as List<dynamic>).map((e) => e as String).toList(),
      comment: json['comment'] as String?,
      dishes: json['dishes'] as String?,
    );

Map<String, dynamic> _$SellerReviewBodyToJson(_SellerReviewBody instance) =>
    <String, dynamic>{
      'createdAt': instance.createdAt.toIso8601String(),
      'customerName': instance.customerName,
      'orderId': instance.orderId,
      'orderNumber': instance.orderNumber,
      'stars': instance.stars,
      'tags': instance.tags,
      'comment': instance.comment,
      'dishes': instance.dishes,
    };
