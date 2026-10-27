// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'push_keys.freezed.dart';
part 'push_keys.g.dart';

@Freezed()
abstract class PushKeys with _$PushKeys {
  const factory PushKeys({required String auth, required String p256dh}) =
      _PushKeys;

  factory PushKeys.fromJson(Map<String, Object?> json) =>
      _$PushKeysFromJson(json);
}
