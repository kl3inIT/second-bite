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

    /// What the collected orders came to at the counter
    required int collectedVnd,

    /// Orders the customer did not come for
    required int expired,

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

    /// Browsers that opened them, each counted once a day
    required int people,

    /// Opens the poster's code brought (utm_source=qr)
    required int qrViews,
    required int refused,
    required int unitsCollected,
    required int unitsHeld,
    required int unitsPosted,

    /// Pages opened
    required int views,
  }) = _CountsBody;

  factory CountsBody.fromJson(Map<String, Object?> json) =>
      _$CountsBodyFromJson(json);
}
