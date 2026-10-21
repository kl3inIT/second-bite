// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'refuse_order_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RefuseOrderRequest _$RefuseOrderRequestFromJson(Map<String, dynamic> json) =>
    _RefuseOrderRequest(
      reason: RefuseOrderRequestReason.fromJson(json['reason'] as String),
      note: json['note'] as String?,
    );

Map<String, dynamic> _$RefuseOrderRequestToJson(_RefuseOrderRequest instance) =>
    <String, dynamic>{
      'reason': _$RefuseOrderRequestReasonEnumMap[instance.reason]!,
      'note': instance.note,
    };

const _$RefuseOrderRequestReasonEnumMap = {
  RefuseOrderRequestReason.notSuitable: 'not_suitable',
  RefuseOrderRequestReason.wrongItems: 'wrong_items',
  RefuseOrderRequestReason.other: 'other',
  RefuseOrderRequestReason.$unknown: r'$unknown',
};
