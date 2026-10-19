// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum SaveEmailSettingsInputBodyProvider {
  @JsonValue('smtp')
  smtp('smtp'),
  @JsonValue('brevo')
  brevo('brevo'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const SaveEmailSettingsInputBodyProvider(this.json);

  factory SaveEmailSettingsInputBodyProvider.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<SaveEmailSettingsInputBodyProvider> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
