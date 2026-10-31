// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'payout_body.dart';

part 'list_payouts_response.freezed.dart';
part 'list_payouts_response.g.dart';

@Freezed()
abstract class ListPayoutsResponse with _$ListPayoutsResponse {
  const factory ListPayoutsResponse({required List<PayoutBody> payouts}) =
      _ListPayoutsResponse;

  factory ListPayoutsResponse.fromJson(Map<String, Object?> json) =>
      _$ListPayoutsResponseFromJson(json);
}
