// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'counts_body.freezed.dart';
part 'counts_body.g.dart';

@Freezed()
abstract class CountsBody with _$CountsBody {
  const factory CountsBody({
    required int cancelled,
    required int collected,

    /// Collected orders whose customer confirmed the collection, the store not having handed them over first
    required int collectedByCustomer,

    /// What the collected orders came to at the counter
    required int collectedVnd,

    /// Collected orders that took a discount
    required int discountOrders,

    /// The discounts Second Bite paid back on the collected orders
    required int discountVnd,

    /// Orders the customer did not come for
    required int expired,

    /// Grams of the units collected whose dish gives a weight
    required int gramsCollected,

    /// Orders, however they ended
    required int held,

    /// Opens of the home; none for a store
    required int homeViews,

    /// Accounts created, the site's whatever store is chosen; none on a store's numbers
    required int newAccounts,

    /// Customers whose first order, by phone number, is collected then; the site's, as newAccounts
    required int newCustomers,

    /// Offers posted for the day
    required int offers,

    /// What the collected orders' dishes cost at their original price
    required int originalVnd,

    /// Browsers that opened them, each counted once a day
    required int people,

    /// Opens the poster's code brought (utm_source=qr)
    required int qrViews,
    required int refused,
    required int unitsCollected,
    required int unitsHeld,
    required int unitsPosted,

    /// The units collected whose dish gives a weight
    required int unitsWeighed,

    /// Pages opened
    required int views,
  }) = _CountsBody;

  factory CountsBody.fromJson(Map<String, Object?> json) =>
      _$CountsBodyFromJson(json);
}
