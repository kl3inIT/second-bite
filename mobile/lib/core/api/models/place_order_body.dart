// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_wanted_body.dart';

part 'place_order_body.freezed.dart';
part 'place_order_body.g.dart';

@Freezed()
abstract class PlaceOrderBody with _$PlaceOrderBody {
  const factory PlaceOrderBody({
    /// One to ten different offers of one seller
    required List<OrderWantedBody>? lines,

    /// The name the seller calls at the counter
    required String name,

    /// A Vietnamese phone number, 0 and nine digits; spaces, dots, dashes and +84 are accepted
    required String phone,

    /// The customer agrees to be told about the order by Zalo once Second Bite sends there
    bool? byZalo,

    /// Shared by the orders placed together from one cart, one per seller; a new one when omitted
    String? checkoutId,
  }) = _PlaceOrderBody;

  factory PlaceOrderBody.fromJson(Map<String, Object?> json) =>
      _$PlaceOrderBodyFromJson(json);
}
