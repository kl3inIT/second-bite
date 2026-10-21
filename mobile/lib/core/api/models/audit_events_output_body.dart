// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'audit_event_body.dart';

part 'audit_events_output_body.freezed.dart';
part 'audit_events_output_body.g.dart';

@Freezed()
abstract class AuditEventsOutputBody with _$AuditEventsOutputBody {
  const factory AuditEventsOutputBody({
    required List<AuditEventBody>? items,
    required int page,
    required int pageSize,
    required int total,
  }) = _AuditEventsOutputBody;

  factory AuditEventsOutputBody.fromJson(Map<String, Object?> json) =>
      _$AuditEventsOutputBodyFromJson(json);
}
