// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'mark_order_messages_seen_request.freezed.dart';
part 'mark_order_messages_seen_request.g.dart';

@Freezed()
abstract class MarkOrderMessagesSeenRequest
    with _$MarkOrderMessagesSeenRequest {
  const factory MarkOrderMessagesSeenRequest({required int upTo}) =
      _MarkOrderMessagesSeenRequest;

  factory MarkOrderMessagesSeenRequest.fromJson(Map<String, Object?> json) =>
      _$MarkOrderMessagesSeenRequestFromJson(json);
}
