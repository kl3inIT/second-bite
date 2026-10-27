// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'send_order_message_request.freezed.dart';
part 'send_order_message_request.g.dart';

@Freezed()
abstract class SendOrderMessageRequest with _$SendOrderMessageRequest {
  const factory SendOrderMessageRequest({
    /// Trimmed; 1 to 1,000 characters
    required String text,
  }) = _SendOrderMessageRequest;

  factory SendOrderMessageRequest.fromJson(Map<String, Object?> json) =>
      _$SendOrderMessageRequestFromJson(json);
}
