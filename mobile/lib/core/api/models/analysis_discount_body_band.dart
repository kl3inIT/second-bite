// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// The discount against the original price
@JsonEnum()
enum AnalysisDiscountBodyBand {
  @JsonValue('free')
  free('free'),
  @JsonValue('from70')
  from70('from70'),
  @JsonValue('from50')
  from50('from50'),
  @JsonValue('from30')
  from30('from30'),
  @JsonValue('under30')
  under30('under30'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const AnalysisDiscountBodyBand(this.json);

  factory AnalysisDiscountBodyBand.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<AnalysisDiscountBodyBand> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
