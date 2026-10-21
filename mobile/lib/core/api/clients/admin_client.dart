// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/account_body.dart';
import '../models/action.dart';
import '../models/admin_accounts_output_body.dart';
import '../models/admin_sellers_output_body.dart';
import '../models/admins_output_body.dart';
import '../models/audit_events_output_body.dart';
import '../models/block_seller_request.dart';
import '../models/email_settings_body.dart';
import '../models/grant_admin_request.dart';
import '../models/history_output_body.dart';
import '../models/memberships_output_body.dart';
import '../models/offer_settings_body.dart';
import '../models/record_body.dart';
import '../models/reject_seller_request.dart';
import '../models/role.dart';
import '../models/save_email_settings_input_body.dart';
import '../models/seller_body.dart';
import '../models/send_test_email_input_body.dart';
import '../models/sort.dart';
import '../models/sort2.dart';
import '../models/status.dart';

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
    @Query('status') List<Status>? status,
    @Query('q') String? q,
    @Query('sort') Sort2? sort,
    @Query('changedSince') DateTime? changedSince,
    @Query('changedUntil') DateTime? changedUntil,
  });

  /// Let a pending, rejected or blocked seller publish; its owner is emailed
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
