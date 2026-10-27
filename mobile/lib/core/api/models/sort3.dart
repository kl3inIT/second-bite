// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// relevance with q, distance with near, ending_soon otherwise, when absent
@JsonEnum()
enum Sort3 {
  @JsonValue('relevance')
  relevance('relevance'),
  @JsonValue('distance')
  distance('distance'),
  @JsonValue('ending_soon')
  endingSoon('ending_soon'),
  @JsonValue('price')
  price('price'),
  @JsonValue('discount')
  discount('discount'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const Sort3(this.json);

  factory Sort3.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<Sort3> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
