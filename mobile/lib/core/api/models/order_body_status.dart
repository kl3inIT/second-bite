// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// expired is read from the window's end
@JsonEnum()
enum OrderBodyStatus {
  @JsonValue('confirmed')
  confirmed('confirmed'),
  @JsonValue('ready')
  ready('ready'),
  @JsonValue('collected')
  collected('collected'),
  @JsonValue('cancelled')
  cancelled('cancelled'),
  @JsonValue('refused')
  refused('refused'),
  @JsonValue('expired')
  expired('expired'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const OrderBodyStatus(this.json);

  factory OrderBodyStatus.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<OrderBodyStatus> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
