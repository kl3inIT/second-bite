// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'push_key_output_body.freezed.dart';
part 'push_key_output_body.g.dart';

@Freezed()
abstract class PushKeyOutputBody with _$PushKeyOutputBody {
  const factory PushKeyOutputBody({
    /// The VAPID public key, in base64url, for PushManager.subscribe's applicationServerKey
    required String publicKey,
  }) = _PushKeyOutputBody;

  factory PushKeyOutputBody.fromJson(Map<String, Object?> json) =>
      _$PushKeyOutputBodyFromJson(json);
}
