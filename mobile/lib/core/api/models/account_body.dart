// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'account_body_role.dart';

part 'account_body.freezed.dart';
part 'account_body.g.dart';

@Freezed()
abstract class AccountBody with _$AccountBody {
  const factory AccountBody({
    /// Empty until Google gives one or the person sets it
    required String displayName,
    required String email,
    required String id,
    required AccountBodyRole role,
  }) = _AccountBody;

  factory AccountBody.fromJson(Map<String, Object?> json) =>
      _$AccountBodyFromJson(json);
}
