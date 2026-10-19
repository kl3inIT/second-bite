// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'google_method_body.freezed.dart';
part 'google_method_body.g.dart';

@Freezed()
abstract class GoogleMethodBody with _$GoogleMethodBody {
  const factory GoogleMethodBody({
    /// The OAuth client ID the web's Google button uses
    required String clientId,
  }) = _GoogleMethodBody;

  factory GoogleMethodBody.fromJson(Map<String, Object?> json) =>
      _$GoogleMethodBodyFromJson(json);
}
