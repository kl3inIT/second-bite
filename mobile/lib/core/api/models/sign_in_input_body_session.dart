// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// token: the token in the body (the mobile application); cookie: the session cookie instead (the web)
@JsonEnum()
enum SignInInputBodySession {
  @JsonValue('token')
  token('token'),
  @JsonValue('cookie')
  cookie('cookie'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const SignInInputBodySession(this.json);

  factory SignInInputBodySession.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<SignInInputBodySession> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
