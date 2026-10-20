// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/account_body.dart';
import '../models/admins_output_body.dart';
import '../models/email_settings_body.dart';
import '../models/grant_admin_request.dart';
import '../models/offer_settings_body.dart';
import '../models/save_email_settings_input_body.dart';
import '../models/seller_body.dart';
import '../models/sellers_output_body.dart';
import '../models/status.dart';

part 'admin_client.g.dart';

@RestApi()
abstract class AdminClient {
  factory AdminClient(Dio dio, {String? baseUrl}) = _AdminClient;

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

  /// Read who delivers email
  @GET('/admin/email-settings')
  Future<EmailSettingsBody> getEmailSettings();

  /// Choose who delivers email; the next email uses it.
  ///
  /// If-Match carries the ETag read; when someone saved since, the answer is 412 and nothing changes. The first settings are saved with `secondbite email configure`.
  ///
  /// [ifMatch] - The ETag of the settings read.
  @PUT('/admin/email-settings')
  Future<void> saveEmailSettings({
    @Header('If-Match') required String ifMatch,
    @Body() required SaveEmailSettingsInputBody body,
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

  /// Sellers in a status, oldest first
  @GET('/admin/sellers')
  Future<SellersOutputBody> listSellersForAdmins({
    @Query('status') Status? status = Status.pending,
    @Query('limit') int? limit = 50,
    @Query('offset') int? offset = 0,
  });

  /// Let a seller publish; also lifts a block
  @POST('/admin/sellers/{sellerId}/activate')
  Future<SellerBody> activateSeller({
    @Path('sellerId') required String sellerId,
  });

  /// Stop a seller from publishing
  @POST('/admin/sellers/{sellerId}/block')
  Future<SellerBody> blockSeller({@Path('sellerId') required String sellerId});
}
