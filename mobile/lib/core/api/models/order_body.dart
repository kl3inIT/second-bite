// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_body_refuse_reason.dart';
import 'order_body_status.dart';
import 'order_line_body.dart';
import 'order_seller_body.dart';
import 'review_body.dart';

part 'order_body.freezed.dart';
part 'order_body.g.dart';

@Freezed()
abstract class OrderBody with _$OrderBody {
  const factory OrderBody({
    /// Shared by the orders placed together from one cart
    required String checkoutId,
    required DateTime createdAt,

    /// Who collects, as given with the order
    required String customerName,

    /// Their phone number, 0 and nine digits
    required String customerPhone,
    required String id,
    required List<OrderLineBody> lines,

    /// What people read aloud, SB- and a number
    required String number,

    /// Where the order is collected, copied when it was placed
    required OrderSellerBody seller,

    /// expired is read from the window's end
    required OrderBodyStatus status,

    /// Paid to the seller at the counter
    required int totalVnd,
    required DateTime windowEnd,
    required DateTime windowStart,

    /// To its customer: proves the order is theirs without signing in, sent back as Order-Access
    String? access,
    String? cancelReason,
    DateTime? cancelledAt,
    DateTime? collectedAt,

    /// Messages its chat holds, with unreadMessages; none for admins
    int? messageCount,
    DateTime? readyAt,
    String? refuseNote,
    OrderBodyRefuseReason? refuseReason,
    DateTime? refusedAt,

    /// The customer's rating of the collected order; none until they rate it
    ReviewBody? review,

    /// Messages of its chat the reader has not read: from the seller for the customer, from the customer for the seller's people; none for admins
    int? unreadMessages,
  }) = _OrderBody;

  factory OrderBody.fromJson(Map<String, Object?> json) =>
      _$OrderBodyFromJson(json);
}
