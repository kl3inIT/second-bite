// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'message_body.dart';
import 'seen_body.dart';

part 'messages_output_body.freezed.dart';
part 'messages_output_body.g.dart';

@Freezed()
abstract class MessagesOutputBody with _$MessagesOutputBody {
  const factory MessagesOutputBody({
    /// Oldest first
    required List<MessageBody> messages,

    /// Whether the chat takes messages
    required bool open,
    required SeenBody seen,

    /// Only once the order is collected: when its chat turns read-only
    DateTime? closesAt,
  }) = _MessagesOutputBody;

  factory MessagesOutputBody.fromJson(Map<String, Object?> json) =>
      _$MessagesOutputBodyFromJson(json);
}
