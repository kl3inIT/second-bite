// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'hand_over_order_request.freezed.dart';
part 'hand_over_order_request.g.dart';

@Freezed()
abstract class HandOverOrderRequest with _$HandOverOrderRequest {
  const factory HandOverOrderRequest({required String code}) =
      _HandOverOrderRequest;

  factory HandOverOrderRequest.fromJson(Map<String, Object?> json) =>
      _$HandOverOrderRequestFromJson(json);
}
