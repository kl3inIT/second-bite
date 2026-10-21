// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'live_ticket_output_body.freezed.dart';
part 'live_ticket_output_body.g.dart';

@Freezed()
abstract class LiveTicketOutputBody with _$LiveTicketOutputBody {
  const factory LiveTicketOutputBody({
    /// Thirty seconds after it was minted
    required DateTime expiresAt,

    /// Sent once in a subscribe frame on GET /live; it works once
    required String ticket,
  }) = _LiveTicketOutputBody;

  factory LiveTicketOutputBody.fromJson(Map<String, Object?> json) =>
      _$LiveTicketOutputBodyFromJson(json);
}
