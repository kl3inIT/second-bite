// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_body_refuse_reason.dart';
import 'order_body_status.dart';
import 'order_line_body.dart';
import 'order_promotion_body.dart';
import 'order_seller_body.dart';
import 'problem_body.dart';
import 'review_body.dart';

part 'order_body.freezed.dart';
part 'order_body.g.dart';

@Freezed()
abstract class OrderBody with _$OrderBody {
  const factory OrderBody({
    /// The order is collected or expired, within two days, and no problem was reported yet
    required bool canReportProblem,

    /// The order is collected and was never rated, so its customer may rate it
    required bool canReview,

    /// Shared by the orders placed together from one cart
    required String checkoutId,
    required DateTime createdAt,

    /// Who collects, as given with the order; empty once the customer deleted their account
    required String customerName,

    /// Their phone number, 0 and nine digits; empty once the customer deleted their account
    required String customerPhone,

    /// What a promotion took off when the order was placed; Second Bite pays it back to the seller
    required int discountVnd,
    required String id,
    required List<OrderLineBody> lines,

    /// What people read aloud, SB- and a number
    required String number,

    /// Paid to the seller at the counter: totalVnd less discountVnd
    required int payVnd,

    /// Where the order is collected, copied when it was placed
    required OrderSellerBody seller,

    /// expired is read from the window's end
    required OrderBodyStatus status,

    /// What the dishes cost
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

    /// What its customer reported went wrong, with the store's answer; none until reported (SEC-84)
    ProblemBody? problem,

    /// The promotion and rule the discount came from; none without a discount
    OrderPromotionBody? promotion,
    DateTime? readyAt,
    String? refuseNote,
    OrderBodyRefuseReason? refuseReason,
    DateTime? refusedAt,

    /// The customer's rating of the collected order; none until they rate it, nor while admins hide it
    ReviewBody? review,

    /// Messages of its chat the reader has not read: from the seller for the customer, from the customer for the seller's people; none for admins
    int? unreadMessages,
  }) = _OrderBody;

  factory OrderBody.fromJson(Map<String, Object?> json) =>
      _$OrderBodyFromJson(json);
}
