// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// Who confirmed the collection: the seller's people, who handed it over, or its customer; none until collected
@JsonEnum()
enum OrderBodyCollectedBy {
  @JsonValue('seller')
  seller('seller'),
  @JsonValue('customer')
  customer('customer'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const OrderBodyCollectedBy(this.json);

  factory OrderBodyCollectedBy.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<OrderBodyCollectedBy> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
