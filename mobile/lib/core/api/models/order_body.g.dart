// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrderBody _$OrderBodyFromJson(Map<String, dynamic> json) => _OrderBody(
  checkoutId: json['checkoutId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  customerName: json['customerName'] as String,
  customerPhone: json['customerPhone'] as String,
  id: json['id'] as String,
  lines: (json['lines'] as List<dynamic>)
      .map((e) => OrderLineBody.fromJson(e as Map<String, dynamic>))
      .toList(),
  number: json['number'] as String,
  seller: OrderSellerBody.fromJson(json['seller'] as Map<String, dynamic>),
  status: OrderBodyStatus.fromJson(json['status'] as String),
  totalVnd: (json['totalVnd'] as num).toInt(),
  windowEnd: DateTime.parse(json['windowEnd'] as String),
  windowStart: DateTime.parse(json['windowStart'] as String),
  access: json['access'] as String?,
  cancelReason: json['cancelReason'] as String?,
  cancelledAt: json['cancelledAt'] == null
      ? null
      : DateTime.parse(json['cancelledAt'] as String),
  collectedAt: json['collectedAt'] == null
      ? null
      : DateTime.parse(json['collectedAt'] as String),
  messageCount: (json['messageCount'] as num?)?.toInt(),
  readyAt: json['readyAt'] == null
      ? null
      : DateTime.parse(json['readyAt'] as String),
  refuseNote: json['refuseNote'] as String?,
  refuseReason: json['refuseReason'] == null
      ? null
      : OrderBodyRefuseReason.fromJson(json['refuseReason'] as String),
  refusedAt: json['refusedAt'] == null
      ? null
      : DateTime.parse(json['refusedAt'] as String),
  review: json['review'] == null
      ? null
      : ReviewBody.fromJson(json['review'] as Map<String, dynamic>),
  unreadMessages: (json['unreadMessages'] as num?)?.toInt(),
);

Map<String, dynamic> _$OrderBodyToJson(_OrderBody instance) =>
    <String, dynamic>{
      'checkoutId': instance.checkoutId,
      'createdAt': instance.createdAt.toIso8601String(),
      'customerName': instance.customerName,
      'customerPhone': instance.customerPhone,
      'id': instance.id,
      'lines': instance.lines,
      'number': instance.number,
      'seller': instance.seller,
      'status': _$OrderBodyStatusEnumMap[instance.status]!,
      'totalVnd': instance.totalVnd,
      'windowEnd': instance.windowEnd.toIso8601String(),
      'windowStart': instance.windowStart.toIso8601String(),
      'access': instance.access,
      'cancelReason': instance.cancelReason,
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
      'collectedAt': instance.collectedAt?.toIso8601String(),
      'messageCount': instance.messageCount,
      'readyAt': instance.readyAt?.toIso8601String(),
      'refuseNote': instance.refuseNote,
      'refuseReason': _$OrderBodyRefuseReasonEnumMap[instance.refuseReason],
      'refusedAt': instance.refusedAt?.toIso8601String(),
      'review': instance.review,
      'unreadMessages': instance.unreadMessages,
    };

const _$OrderBodyStatusEnumMap = {
  OrderBodyStatus.confirmed: 'confirmed',
  OrderBodyStatus.ready: 'ready',
  OrderBodyStatus.collected: 'collected',
  OrderBodyStatus.cancelled: 'cancelled',
  OrderBodyStatus.refused: 'refused',
  OrderBodyStatus.expired: 'expired',
  OrderBodyStatus.$unknown: r'$unknown',
};

const _$OrderBodyRefuseReasonEnumMap = {
  OrderBodyRefuseReason.notSuitable: 'not_suitable',
  OrderBodyRefuseReason.wrongItems: 'wrong_items',
  OrderBodyRefuseReason.noAnswer: 'no_answer',
  OrderBodyRefuseReason.noShow: 'no_show',
  OrderBodyRefuseReason.valueLate: 'late',
  OrderBodyRefuseReason.soldOut: 'sold_out',
  OrderBodyRefuseReason.other: 'other',
  OrderBodyRefuseReason.withdrawn: 'withdrawn',
  OrderBodyRefuseReason.$unknown: r'$unknown',
};
