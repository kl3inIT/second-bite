// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'audit_change_body.freezed.dart';
part 'audit_change_body.g.dart';

@Freezed()
abstract class AuditChangeBody with _$AuditChangeBody {
  const factory AuditChangeBody({
    required String field,

    /// The value before; absent for a secret or the SMTP user
    String? from,

    /// The value after; absent likewise
    String? to,
  }) = _AuditChangeBody;

  factory AuditChangeBody.fromJson(Map<String, Object?> json) =>
      _$AuditChangeBodyFromJson(json);
}
