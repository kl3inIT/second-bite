// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum OrderBodyRefuseReason {
  @JsonValue('not_suitable')
  notSuitable('not_suitable'),
  @JsonValue('wrong_items')
  wrongItems('wrong_items'),
  @JsonValue('no_answer')
  noAnswer('no_answer'),
  @JsonValue('no_show')
  noShow('no_show'),

  /// The name has been replaced because it contains a keyword. Original name: `late`.
  @JsonValue('late')
  valueLate('late'),
  @JsonValue('sold_out')
  soldOut('sold_out'),
  @JsonValue('other')
  other('other'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const OrderBodyRefuseReason(this.json);

  factory OrderBodyRefuseReason.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<OrderBodyRefuseReason> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
