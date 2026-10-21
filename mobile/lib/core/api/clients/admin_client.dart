// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/admin_summary_body.dart';
import '../models/offer_settings_body.dart';
import '../models/seller_body.dart';
import '../models/sellers_output_body.dart';
import '../models/status.dart';

part 'admin_client.g.dart';

@RestApi()
abstract class AdminClient {
  factory AdminClient(Dio dio, {String? baseUrl}) = _AdminClient;

  /// The rules every offer follows
  @GET('/admin/offer-settings')
  Future<OfferSettingsBody> getOfferSettings();

  /// Change the rules every offer follows.
  ///
  /// New rules apply to offers posted, and to the prices and windows changed, after they are saved.
  @PUT('/admin/offer-settings')
  Future<OfferSettingsBody> saveOfferSettings({
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

  /// The figures of the admins' dashboard over a range of days.
  ///
  /// Sellers by status now and at the end of each day, and opened in the range; offers posted in the range, per day and by seller, and open now; accounts in all and created in the range, per day. Days are in Vietnam time; the range is at most 90 days and the last 30 without one. Orders and payments are not counted yet.
  ///
  /// [from] - The range's first day in Vietnam time; 29 days before to when absent.
  ///
  /// [to] - The range's last day in Vietnam time, included; today when absent.
  @GET('/admin/summary')
  Future<AdminSummaryBody> getAdminSummary({
    @Query('from') DateTime? from,
    @Query('to') DateTime? to,
  });
}
