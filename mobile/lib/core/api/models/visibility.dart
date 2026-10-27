// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// Keep the shown or the hidden reviews; both when absent
@JsonEnum()
enum Visibility {
  @JsonValue('visible')
  visible('visible'),
  @JsonValue('hidden')
  hidden('hidden'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const Visibility(this.json);

  factory Visibility.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<Visibility> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
