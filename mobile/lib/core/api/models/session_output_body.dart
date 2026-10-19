// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'account_body.dart';

part 'session_output_body.freezed.dart';
part 'session_output_body.g.dart';

@Freezed()
abstract class SessionOutputBody with _$SessionOutputBody {
  const factory SessionOutputBody({
    required AccountBody account,

    /// The session ends then unless it is used; each use moves the end 30 days on
    required DateTime expiresAt,

    /// Send it as Authorization: Bearer <token>; it is shown only now, and not when the cookie was asked for
    String? token,
  }) = _SessionOutputBody;

  factory SessionOutputBody.fromJson(Map<String, Object?> json) =>
      _$SessionOutputBodyFromJson(json);
}
