// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'request_code_input_body.freezed.dart';
part 'request_code_input_body.g.dart';

@Freezed()
abstract class RequestCodeInputBody with _$RequestCodeInputBody {
  const factory RequestCodeInputBody({
    /// The address to send the code to
    required String email,
  }) = _RequestCodeInputBody;

  factory RequestCodeInputBody.fromJson(Map<String, Object?> json) =>
      _$RequestCodeInputBodyFromJson(json);
}
