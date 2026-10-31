// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// Read from its times and whether it is enabled
@JsonEnum()
enum PromotionBodyStatus {
  @JsonValue('running')
  running('running'),
  @JsonValue('scheduled')
  scheduled('scheduled'),
  @JsonValue('paused')
  paused('paused'),
  @JsonValue('ended')
  ended('ended'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const PromotionBodyStatus(this.json);

  factory PromotionBodyStatus.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<PromotionBodyStatus> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
