// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// name, created or signedIn; a leading - is descending; the newest first when absent
@JsonEnum()
enum Sort {
  @JsonValue('name')
  name('name'),
  @JsonValue('-name')
  minusName('-name'),
  @JsonValue('created')
  created('created'),
  @JsonValue('-created')
  minusCreated('-created'),
  @JsonValue('signedIn')
  signedIn('signedIn'),
  @JsonValue('-signedIn')
  minusSignedIn('-signedIn'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const Sort(this.json);

  factory Sort.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<Sort> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
