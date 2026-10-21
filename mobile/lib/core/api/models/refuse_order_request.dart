// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'refuse_order_request_reason.dart';

part 'refuse_order_request.freezed.dart';
part 'refuse_order_request.g.dart';

@Freezed()
abstract class RefuseOrderRequest with _$RefuseOrderRequest {
  const factory RefuseOrderRequest({
    required RefuseOrderRequestReason reason,
    String? note,
  }) = _RefuseOrderRequest;

  factory RefuseOrderRequest.fromJson(Map<String, Object?> json) =>
      _$RefuseOrderRequestFromJson(json);
}
