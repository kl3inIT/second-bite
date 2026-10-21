// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'orders_output_body.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OrdersOutputBody _$OrdersOutputBodyFromJson(Map<String, dynamic> json) =>
    _OrdersOutputBody(
      orders: (json['orders'] as List<dynamic>)
          .map((e) => OrderBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$OrdersOutputBodyToJson(_OrdersOutputBody instance) =>
    <String, dynamic>{'orders': instance.orders};
