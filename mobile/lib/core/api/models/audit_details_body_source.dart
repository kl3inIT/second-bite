// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// Where a change of admins came from
@JsonEnum()
enum AuditDetailsBodySource {
  @JsonValue('admin')
  admin('admin'),
  @JsonValue('command_line')
  commandLine('command_line'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const AuditDetailsBodySource(this.json);

  factory AuditDetailsBodySource.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<AuditDetailsBodySource> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
