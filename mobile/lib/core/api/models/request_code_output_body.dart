// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'request_code_output_body.freezed.dart';
part 'request_code_output_body.g.dart';

@Freezed()
abstract class RequestCodeOutputBody with _$RequestCodeOutputBody {
  const factory RequestCodeOutputBody({
    /// Send it back with the code
    required String challengeId,
    required DateTime expiresAt,
  }) = _RequestCodeOutputBody;

  factory RequestCodeOutputBody.fromJson(Map<String, Object?> json) =>
      _$RequestCodeOutputBodyFromJson(json);
}
