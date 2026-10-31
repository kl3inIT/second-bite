// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'audit_change_body.dart';
import 'audit_details_body_provider.dart';
import 'audit_details_body_source.dart';

part 'audit_details_body.freezed.dart';
part 'audit_details_body.g.dart';

@Freezed()
abstract class AuditDetailsBody with _$AuditDetailsBody {
  const factory AuditDetailsBody({
    /// The amount marked paid
    int? amountVnd,

    /// The settings changed
    List<AuditChangeBody>? changes,

    /// The name of a promotion set up
    String? name,

    /// Who delivers email after the change
    AuditDetailsBodyProvider? provider,

    /// What the owner was told, for a rejection or a block; the admin's reason, for a hidden review
    String? reason,

    /// Where a change of admins came from
    AuditDetailsBodySource? source,

    /// The Monday of a week of discounts marked paid
    String? weekStart,
  }) = _AuditDetailsBody;

  factory AuditDetailsBody.fromJson(Map<String, Object?> json) =>
      _$AuditDetailsBodyFromJson(json);
}
