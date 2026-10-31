// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_payouts_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ListPayoutsResponse _$ListPayoutsResponseFromJson(Map<String, dynamic> json) =>
    _ListPayoutsResponse(
      payouts: (json['payouts'] as List<dynamic>)
          .map((e) => PayoutBody.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ListPayoutsResponseToJson(
  _ListPayoutsResponse instance,
) => <String, dynamic>{'payouts': instance.payouts};
