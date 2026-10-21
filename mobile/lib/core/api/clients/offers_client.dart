// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/found_output_body.dart';
import '../models/kind.dart';
import '../models/offer_body.dart';
import '../models/offer_change_body.dart';
import '../models/offer_details_body.dart';
import '../models/offers_output_body.dart';
import '../models/sort.dart';
import '../models/status2.dart';

part 'offers_client.g.dart';

@RestApi()
abstract class OffersClient {
  factory OffersClient(Dio dio, {String? baseUrl}) = _OffersClient;

  /// Find offers on sale or sold out, near a point, by words and filters.
  ///
  /// Anyone may search. Offers sold out are included unless available is set; those withdrawn, over or of a blocked seller never are.
  ///
  /// [near] - latitude,longitude, such as 21.0565,105.8964.
  ///
  /// [radiusKm] - Around near; the settings' default when absent, never more than their maximum.
  ///
  /// [q] - Words; typed without marks they match any marks ("ca" finds cá and cà), with marks only those.
  ///
  /// [kind] - One or more kinds, comma-separated.
  ///
  /// [minPrice] - The lowest price of one unit, in đồng.
  ///
  /// [maxPrice] - The highest price of one unit, in đồng.
  ///
  /// [collectFrom] - Keep offers whose window overlaps collectFrom to collectTo; both at one moment keep what can be collected then.
  ///
  /// [sellerId] - One seller's offers.
  ///
  /// [available] - Leave out what has sold out.
  ///
  /// [sort] - relevance with q, distance with near, ending_soon otherwise, when absent.
  @GET('/offers')
  Future<FoundOutputBody> searchOffers({
    @Query('limit') int? limit = 20,
    @Query('offset') int? offset = 0,
    @Query('near') String? near,
    @Query('radiusKm') int? radiusKm,
    @Query('q') String? q,
    @Query('kind') List<Kind>? kind,
    @Query('minPrice') int? minPrice,
    @Query('maxPrice') int? maxPrice,
    @Query('collectFrom') DateTime? collectFrom,
    @Query('collectTo') DateTime? collectTo,
    @Query('sellerId') String? sellerId,
    @Query('available') bool? available,
    @Query('sort') Sort? sort,
  });

  /// An offer.
  ///
  /// Anyone reads an offer while its window is open and it is not withdrawn; its seller's people read it always.
  @GET('/offers/{offerId}')
  Future<OfferBody> getOffer({@Path('offerId') required String offerId});

  /// Change an offer.
  ///
  /// Once units are ordered, only the description, the photo and the units (never below those ordered) change.
  @PATCH('/offers/{offerId}')
  Future<OfferBody> changeOffer({
    @Path('offerId') required String offerId,
    @Body() required OfferChangeBody body,
  });

  /// Take an offer off sale for good
  @POST('/offers/{offerId}/withdraw')
  Future<OfferBody> withdrawOffer({@Path('offerId') required String offerId});

  /// A seller's offers, newest first, to its people and admins
  @GET('/sellers/{sellerId}/offers')
  Future<OffersOutputBody> listSellerOffers({
    @Path('sellerId') required String sellerId,
    @Query('limit') int? limit = 20,
    @Query('offset') int? offset = 0,
    @Query('status') Status2? status,
  });

  /// Put surplus on sale for a seller you own or work for.
  ///
  /// Posting again: send the details of an earlier offer, its photo included, with new units and window.
  @POST('/sellers/{sellerId}/offers')
  Future<OfferBody> postOffer({
    @Path('sellerId') required String sellerId,
    @Body() required OfferDetailsBody body,
  });
}
