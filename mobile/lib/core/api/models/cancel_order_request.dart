// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'cancel_order_request.freezed.dart';
part 'cancel_order_request.g.dart';

@Freezed()
abstract class CancelOrderRequest with _$CancelOrderRequest {
  const factory CancelOrderRequest({String? reason}) = _CancelOrderRequest;

  factory CancelOrderRequest.fromJson(Map<String, Object?> json) =>
      _$CancelOrderRequestFromJson(json);
}
