// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'audit_details_body.dart';
import 'audit_event_body_action.dart';
import 'audit_event_body_resource_type.dart';

part 'audit_event_body.freezed.dart';
part 'audit_event_body.g.dart';

@Freezed()
abstract class AuditEventBody with _$AuditEventBody {
  const factory AuditEventBody({
    required AuditEventBodyAction action,
    required AuditDetailsBody details,
    required String id,
    required DateTime occurredAt,
    required String resourceId,
    required AuditEventBodyResourceType resourceType,
    String? actorId,
    String? actorLabel,

    /// The store's name, the account's address or the order's number at the time; absent once that account is deleted
    String? resourceLabel,
  }) = _AuditEventBody;

  factory AuditEventBody.fromJson(Map<String, Object?> json) =>
      _$AuditEventBodyFromJson(json);
}
