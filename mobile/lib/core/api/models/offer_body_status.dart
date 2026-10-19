// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// sold_out and closed are read from the units left and the window
@JsonEnum()
enum OfferBodyStatus {
  @JsonValue('on_sale')
  onSale('on_sale'),
  @JsonValue('sold_out')
  soldOut('sold_out'),
  @JsonValue('closed')
  closed('closed'),
  @JsonValue('withdrawn')
  withdrawn('withdrawn'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const OfferBodyStatus(this.json);

  factory OfferBodyStatus.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<OfferBodyStatus> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
