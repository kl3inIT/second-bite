// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

/// The caller's role; absent for an admin who is not a member
@JsonEnum()
enum SellerBodyMyRole {
  @JsonValue('owner')
  owner('owner'),
  @JsonValue('staff')
  staff('staff'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const SellerBodyMyRole(this.json);

  factory SellerBodyMyRole.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<SellerBodyMyRole> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
