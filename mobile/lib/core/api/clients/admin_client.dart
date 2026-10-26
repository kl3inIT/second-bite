// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/account_body.dart';
import '../models/action.dart';
import '../models/admin_accounts_output_body.dart';
import '../models/admin_offers_output_body.dart';
import '../models/admin_orders_output_body.dart';
import '../models/admin_review_body.dart';
import '../models/admin_reviews_output_body.dart';
import '../models/admin_sellers_output_body.dart';
import '../models/admins_output_body.dart';
import '../models/audit_events_output_body.dart';
import '../models/block_seller_request.dart';
import '../models/email_settings_body.dart';
import '../models/feedback_output_body.dart';
import '../models/grant_admin_request.dart';
import '../models/hide_review_request.dart';
import '../models/history_output_body.dart';
import '../models/memberships_output_body.dart';
import '../models/offer_settings_body.dart';
import '../models/record_body.dart';
import '../models/reject_seller_request.dart';
import '../models/report_output_body.dart';
import '../models/role.dart';
import '../models/save_email_settings_input_body.dart';
import '../models/seller_body.dart';
import '../models/send_test_email_input_body.dart';
import '../models/sort.dart';
import '../models/sort2.dart';
import '../models/status.dart';
import '../models/status2.dart';
import '../models/status3.dart';
import '../models/visibility.dart';

part 'admin_client.g.dart';

@RestApi()
abstract class AdminClient {
  factory AdminClient(Dio dio, {String? baseUrl}) = _AdminClient;

  /// Accounts by role and words, the newest first.
  ///
  /// q matches the address or the name, Vietnamese marks ignored. Sorted by last sign-in, those never signed in come last. A page past the end is empty.
  ///
  /// [role] - Keep this role; every role when absent.
  ///
  /// [q] - Words of the address or the name.
  ///
  /// [sort] - name, created or signedIn; a leading - is descending; the newest first when absent.
  @GET('/admin/accounts')
  Future<AdminAccountsOutputBody> listAccounts({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('role') Role? role,
    @Query('q') String? q,
    @Query('sort') Sort? sort,
  });

  /// An account, with when and how it last signed in
  @GET('/admin/accounts/{accountId}')
  Future<RecordBody> getAccountForAdmins({
    @Path('accountId') required String accountId,
  });

  /// What an account ordered: counts and the latest five orders
  @GET('/admin/accounts/{accountId}/orders')
  Future<HistoryOutputBody> getAccountOrderHistory({
    @Path('accountId') required String accountId,
  });

  /// Every admin, by address
  @GET('/admin/admins')
  Future<AdminsOutputBody> listAdmins();

  /// Make the account of an address an admin.
  ///
  /// Creates the account when the address has never signed in; its owner signs in with an emailed code. Granting an admin again changes nothing.
  @POST('/admin/admins')
  Future<AccountBody> grantAdmin({@Body() required GrantAdminRequest body});

  /// Make an admin a customer again; never oneself nor the last admin.
  ///
  /// The account's next request is a customer's; its sessions stay. Revoking a customer changes nothing.
  @POST('/admin/admins/{accountId}/revoke')
  Future<AccountBody> revokeAdmin({
    @Path('accountId') required String accountId,
  });

  /// What admins did, the latest first.
  ///
  /// Only the actions of the audit catalog are recorded. A page past the end is empty.
  ///
  /// [action] - Keep these actions; every action when absent.
  ///
  /// [actorId] - Keep one admin's actions.
  ///
  /// [since] - Keep what happened at or after this time.
  ///
  /// [until] - Keep what happened before this time.
  ///
  /// [q] - Words of the admin's or the resource's label, or the resource's identifier.
  @GET('/admin/audit-events')
  Future<AuditEventsOutputBody> listAuditEvents({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('action') List<Action>? action,
    @Query('actorId') String? actorId,
    @Query('since') DateTime? since,
    @Query('until') DateTime? until,
    @Query('q') String? q,
  });

  /// Read who delivers email
  @GET('/admin/email-settings')
  Future<EmailSettingsBody> getEmailSettings();

  /// Choose who delivers email; the next email uses it.
  ///
  /// If-Match carries the ETag read, or If-None-Match: * saves the first settings; when someone saved since, the answer is 412 and nothing changes. Without either the answer is 400.
  ///
  /// [ifMatch] - The ETag of the settings read.
  ///
  /// [ifNoneMatch] - * to save the first settings, when none were read.
  @PUT('/admin/email-settings')
  Future<void> saveEmailSettings({
    @Body() required SaveEmailSettingsInputBody body,
    @Header('If-Match') String? ifMatch,
    @Header('If-None-Match') String? ifNoneMatch,
  });

  /// Send one email through the settings saved, to an address or to oneself
  @POST('/admin/email-settings/test')
  Future<void> sendTestEmail({@Body() SendTestEmailInputBody? body});

  /// The sellers some accounts own or work at, owners first.
  ///
  /// [accountId] - The accounts, at most 100.
  @GET('/admin/memberships')
  Future<MembershipsOutputBody> listMembershipsForAdmins({
    @Query('accountId') required List<String>? accountId,
  });

  /// The rules every offer follows
  @GET('/admin/offer-settings')
  Future<OfferSettingsBody> getOfferSettings();

  /// Change the rules every offer follows.
  ///
  /// New rules apply to offers posted, and to the prices and windows changed, after they are saved. If-Match carries the ETag read; when someone saved since, the answer is 412 and nothing changes.
  ///
  /// [ifMatch] - The ETag of the settings read.
  @PUT('/admin/offer-settings')
  Future<OfferSettingsBody> saveOfferSettings({
    @Header('If-Match') required String ifMatch,
    @Body() required OfferSettingsBody body,
  });

  /// Every seller's offers by status, words, seller and day posted, newest first.
  ///
  /// q matches the dish, the seller's name or the description, as customers search. counts holds the offers of each status matching the other filters. A page past the end is empty.
  ///
  /// [status] - Keep this status; every status when absent.
  ///
  /// [q] - Words of the dish, the seller's name or the description.
  ///
  /// [sellerId] - Keep this seller's offers.
  ///
  /// [postedSince] - Keep the offers posted at or after this time.
  ///
  /// [postedUntil] - Keep the offers posted before this time.
  @GET('/admin/offers')
  Future<AdminOffersOutputBody> listOffersForAdmins({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('status') Status? status,
    @Query('q') String? q,
    @Query('sellerId') String? sellerId,
    @Query('postedSince') DateTime? postedSince,
    @Query('postedUntil') DateTime? postedUntil,
  });

  /// Every seller's orders by status, words, seller and day collected, the latest window first.
  ///
  /// q matches the number (SB-24831 or 24831), the customer's name or phone, or the seller's name, Vietnamese marks ignored. An order still to collect whose window is over is expired. counts holds the orders of each status matching the other filters. A page past the end is empty.
  ///
  /// [status] - Keep these statuses; every status when absent.
  ///
  /// [q] - The number, the customer's name or phone, or the seller's name.
  ///
  /// [sellerId] - Keep this seller's orders.
  ///
  /// [collectSince] - Keep the orders whose window starts at or after this time.
  ///
  /// [collectUntil] - Keep the orders whose window starts before this time.
  @GET('/admin/orders')
  Future<AdminOrdersOutputBody> listOrdersForAdmins({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('status') List<Status2>? status,
    @Query('q') String? q,
    @Query('sellerId') String? sellerId,
    @Query('collectSince') DateTime? collectSince,
    @Query('collectUntil') DateTime? collectUntil,
  });

  /// The prototype's numbers per day and store: pages opened, posts and orders.
  ///
  /// Days are Vietnam's; posts and orders count on their collection day. People add up over days, since a visitor is counted once a day.
  ///
  /// [since] - The first day in Vietnam, YYYY-MM-DD; six days before until when empty.
  ///
  /// [until] - The last day in Vietnam, YYYY-MM-DD, included; today when empty.
  ///
  /// [sellerId] - Keep one store's numbers; the views are then its page's and its dishes'.
  @GET('/admin/reports')
  Future<ReportOutputBody> getReport({
    @Query('since') String? since,
    @Query('until') String? until,
    @Query('sellerId') String? sellerId,
  });

  /// The report as a CSV file, one row per day and store.
  ///
  /// The same numbers as getReport, in Vietnamese, for the sponsor's sheet: a row for the whole site on each day when no store is chosen, a row per store and day, and the totals last. UTF-8 with a byte order mark.
  ///
  /// [since] - The first day in Vietnam, YYYY-MM-DD; six days before until when empty.
  ///
  /// [until] - The last day in Vietnam, YYYY-MM-DD, included; today when empty.
  ///
  /// [sellerId] - Keep one store's numbers; the views are then its page's and its dishes'.
  @GET('/admin/reports/export')
  Future<void> exportReport({
    @Query('since') String? since,
    @Query('until') String? until,
    @Query('sellerId') String? sellerId,
  });

  /// Every customer's review, hidden or not, by stars, words, seller, visibility and day, the latest first.
  ///
  /// q matches the comment, the order's number (SB-24831 or 24831), the customer's name or phone, or the seller's name, Vietnamese marks ignored. A page past the end is empty.
  ///
  /// [stars] - Keep the reviews giving these stars; any when absent.
  ///
  /// [q] - The comment, the order's number, the customer's name or phone, or the seller's name.
  ///
  /// [sellerId] - Keep this seller's reviews.
  ///
  /// [visibility] - Keep the shown or the hidden reviews; both when absent.
  ///
  /// [reviewedSince] - Keep the reviews given at or after this time.
  ///
  /// [reviewedUntil] - Keep the reviews given before this time.
  @GET('/admin/reviews')
  Future<AdminReviewsOutputBody> listReviewsForAdmins({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('stars') List<int>? stars,
    @Query('q') String? q,
    @Query('sellerId') String? sellerId,
    @Query('visibility') Visibility? visibility,
    @Query('reviewedSince') DateTime? reviewedSince,
    @Query('reviewedUntil') DateTime? reviewedUntil,
  });

  /// Hide a review from every read but the admins'; its customer is not told.
  ///
  /// The reason is optional, at most 500 characters, and kept in the audit only. The order cannot be rated again while its review is hidden.
  @POST('/admin/reviews/{orderId}/hide')
  Future<AdminReviewBody> hideReview({
    @Path('orderId') required String orderId,
    @Body() HideReviewRequest? body,
  });

  /// Show a hidden review again everywhere
  @POST('/admin/reviews/{orderId}/show')
  Future<AdminReviewBody> showReview({
    @Path('orderId') required String orderId,
  });

  /// What the stores told the team, in a range of days, the latest first.
  ///
  /// At most 200; of one store when sellerId is given (SEC-82). The days are Vietnam's, as the report's.
  ///
  /// [since] - The first day in Vietnam, YYYY-MM-DD; six days before until when empty.
  ///
  /// [until] - The last day in Vietnam, YYYY-MM-DD, included; today when empty.
  ///
  /// [sellerId] - Keep one store's feedback.
  @GET('/admin/seller-feedback')
  Future<FeedbackOutputBody> listSellerFeedbackForAdmins({
    @Query('since') String? since,
    @Query('until') String? until,
    @Query('sellerId') String? sellerId,
  });

  /// Sellers by status and words, pending ones first.
  ///
  /// Pending sellers come first, the oldest first; then the latest change first. q matches the name, address or phone, Vietnamese marks ignored. A page past the end is empty.
  ///
  /// [status] - Keep these statuses; every status when absent.
  ///
  /// [q] - Words of the name, address or phone.
  ///
  /// [sort] - name, address or changed; a leading - is descending; the queue order when absent.
  ///
  /// [changedSince] - Keep the sellers last changed at or after this time.
  ///
  /// [changedUntil] - Keep the sellers last changed before this time.
  @GET('/admin/sellers')
  Future<AdminSellersOutputBody> listSellersForAdmins({
    @Query('page') int? page = 1,
    @Query('size') int? size = 25,
    @Query('status') List<Status3>? status,
    @Query('q') String? q,
    @Query('sort') Sort2? sort,
    @Query('changedSince') DateTime? changedSince,
    @Query('changedUntil') DateTime? changedUntil,
  });

  /// Let a pending, rejected or blocked seller publish; its owner is emailed. A seller whose owner deleted their account is refused
  @POST('/admin/sellers/{sellerId}/approve')
  Future<SellerBody> approveSeller({
    @Path('sellerId') required String sellerId,
  });

  /// Stop an active seller; its owner is emailed the reason
  @POST('/admin/sellers/{sellerId}/block')
  Future<SellerBody> blockSeller({
    @Path('sellerId') required String sellerId,
    @Body() required BlockSellerRequest body,
  });

  /// Refuse a pending seller; its owner is emailed the reason
  @POST('/admin/sellers/{sellerId}/reject')
  Future<SellerBody> rejectSeller({
    @Path('sellerId') required String sellerId,
    @Body() required RejectSellerRequest body,
  });
}
