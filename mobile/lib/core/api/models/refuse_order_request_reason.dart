// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum RefuseOrderRequestReason {
  @JsonValue('not_suitable')
  notSuitable('not_suitable'),
  @JsonValue('wrong_items')
  wrongItems('wrong_items'),
  @JsonValue('other')
  other('other'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const RefuseOrderRequestReason(this.json);

  factory RefuseOrderRequestReason.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<RefuseOrderRequestReason> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
