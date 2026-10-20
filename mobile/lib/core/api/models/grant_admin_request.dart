// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'grant_admin_request.freezed.dart';
part 'grant_admin_request.g.dart';

@Freezed()
abstract class GrantAdminRequest with _$GrantAdminRequest {
  const factory GrantAdminRequest({
    /// The address of the account
    required String email,
  }) = _GrantAdminRequest;

  factory GrantAdminRequest.fromJson(Map<String, Object?> json) =>
      _$GrantAdminRequestFromJson(json);
}
