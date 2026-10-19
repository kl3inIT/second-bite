// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum EmailSettingsBodySmtpSecurity {
  @JsonValue('starttls')
  starttls('starttls'),
  @JsonValue('tls')
  tls('tls'),
  @JsonValue('none')
  none('none'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const EmailSettingsBodySmtpSecurity(this.json);

  factory EmailSettingsBodySmtpSecurity.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<EmailSettingsBodySmtpSecurity> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
