// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'offer_units_output_body.freezed.dart';
part 'offer_units_output_body.g.dart';

@Freezed()
abstract class OfferUnitsOutputBody with _$OfferUnitsOutputBody {
  const factory OfferUnitsOutputBody({
    /// Units handed over
    required int collected,

    /// Orders handed over that hold them
    required int collectedOrders,

    /// Units of orders still to collect, their window not over
    required int held,

    /// Orders still to collect that hold them
    required int heldOrders,

    /// Units nobody holds: units_left of the offers
    required int left,

    /// Of left, those on offers closed, withdrawn or whose window is over
    required int leftover,

    /// Units of orders ended without a hand-over that did not come back: expired, or refused for anything but the customer not coming
    required int missed,

    /// Orders that lost them
    required int missedOrders,

    /// Their units
    required int posted,

    /// Offers matching the filters
    required int posts,
  }) = _OfferUnitsOutputBody;

  factory OfferUnitsOutputBody.fromJson(Map<String, Object?> json) =>
      _$OfferUnitsOutputBodyFromJson(json);
}
