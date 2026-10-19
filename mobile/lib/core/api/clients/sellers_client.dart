// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/add_seller_staff_request.dart';
import '../models/details_body.dart';
import '../models/member_body.dart';
import '../models/members_output_body.dart';
import '../models/seller_body.dart';
import '../models/seller_profile_body.dart';
import '../models/sellers_output_body.dart';
import '../models/set_seller_photo_request.dart';

part 'sellers_client.g.dart';

@RestApi()
abstract class SellersClient {
  factory SellersClient(Dio dio, {String? baseUrl}) = _SellersClient;

  /// Open a seller; it waits for an admin to activate it
  @POST('/sellers')
  Future<SellerBody> openSeller({@Body() required DetailsBody body});

  /// The sellers I own or work for
  @GET('/sellers/mine')
  Future<SellersOutputBody> listMySellers();

  /// A seller, to its members and admins
  @GET('/sellers/{sellerId}')
  Future<SellerBody> getSeller({@Path('sellerId') required String sellerId});

  /// Change a seller's details; only its owner may
  @PUT('/sellers/{sellerId}')
  Future<SellerBody> updateSeller({
    @Path('sellerId') required String sellerId,
    @Body() required DetailsBody body,
  });

  /// The owner and staff of a seller
  @GET('/sellers/{sellerId}/members')
  Future<MembersOutputBody> listSellerMembers({
    @Path('sellerId') required String sellerId,
  });

  /// Add a staff member by email; only the owner may.
  ///
  /// The person is staff at once and signs in with an emailed code to that address.
  @POST('/sellers/{sellerId}/members')
  Future<MemberBody> addSellerStaff({
    @Path('sellerId') required String sellerId,
    @Body() required AddSellerStaffRequest body,
  });

  /// Remove a staff member, or leave the seller
  @DELETE('/sellers/{sellerId}/members/{accountId}')
  Future<void> removeSellerMember({
    @Path('sellerId') required String sellerId,
    @Path('accountId') required String accountId,
  });

  /// Remove the seller's photo; only the owner may
  @DELETE('/sellers/{sellerId}/photo')
  Future<void> removeSellerPhoto({@Path('sellerId') required String sellerId});

  /// Set the seller's photo, uploaded by its owner; only the owner may
  @PUT('/sellers/{sellerId}/photo')
  Future<SellerBody> setSellerPhoto({
    @Path('sellerId') required String sellerId,
    @Body() required SetSellerPhotoRequest body,
  });

  /// What anyone sees of an active seller.
  ///
  /// Its offers are GET /offers?sellerId=. A seller pending or blocked answers 404.
  @GET('/sellers/{sellerId}/profile')
  Future<SellerProfileBody> getSellerProfile({
    @Path('sellerId') required String sellerId,
  });
}
