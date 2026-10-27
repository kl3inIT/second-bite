// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum OfferBodyKind {
  @JsonValue('bakery')
  bakery('bakery'),
  @JsonValue('prepared_food')
  preparedFood('prepared_food'),
  @JsonValue('ingredients')
  ingredients('ingredients'),
  @JsonValue('drinks')
  drinks('drinks'),
  @JsonValue('mixed_box')
  mixedBox('mixed_box'),
  @JsonValue('dessert')
  dessert('dessert'),
  @JsonValue('snacks')
  snacks('snacks'),
  @JsonValue('produce')
  produce('produce'),
  @JsonValue('other')
  other('other'),

  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const OfferBodyKind(this.json);

  factory OfferBodyKind.fromJson(String json) =>
      values.firstWhere((e) => e.json == json, orElse: () => $unknown);

  final String? json;

  @override
  String toString() => json?.toString() ?? super.toString();

  /// Returns all defined enum values excluding the $unknown value.
  static List<OfferBodyKind> get $valuesDefined =>
      values.where((value) => value != $unknown).toList();
}
