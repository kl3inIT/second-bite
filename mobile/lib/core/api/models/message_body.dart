// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'message_body_from.dart';

part 'message_body.freezed.dart';
part 'message_body.g.dart';

@Freezed()
abstract class MessageBody with _$MessageBody {
  const factory MessageBody({
    required MessageBodyFrom from,
    required DateTime sentAt,

    /// Its number in the chat, from 1
    required int seq,
    required String text,
  }) = _MessageBody;

  factory MessageBody.fromJson(Map<String, Object?> json) =>
      _$MessageBodyFromJson(json);
}
