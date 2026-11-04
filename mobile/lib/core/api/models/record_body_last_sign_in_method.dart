// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// How it last signed in: an emailed code, Google or a password
@JsonEnum()
enum RecordBodyLastSignInMethod {
  @JsonValue('code')
  code('code'),
  @JsonValue('google')
  google('google'),
  @JsonValue('password')
  password('password'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const RecordBodyLastSignInMethod(this.json);

  factory RecordBodyLastSignInMethod.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<RecordBodyLastSignInMethod> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
