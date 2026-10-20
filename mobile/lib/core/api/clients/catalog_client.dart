// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/dish_body.dart';
import '../models/dish_change_body.dart';
import '../models/dish_details_body.dart';
import '../models/list_dishes_response.dart';

part 'catalog_client.g.dart';

@RestApi()
abstract class CatalogClient {
  factory CatalogClient(Dio dio, {String? baseUrl}) = _CatalogClient;

  /// Delete a dish from the catalog.
  ///
  /// The offers posted from it are not affected.
  @DELETE('/dishes/{dishId}')
  Future<void> removeDish({@Path('dishId') required String dishId});

  /// Change a dish, or show or hide it
  @PATCH('/dishes/{dishId}')
  Future<DishBody> changeDish({
    @Path('dishId') required String dishId,
    @Body() required DishChangeBody body,
  });

  /// A seller's catalog, the newest dish first, hidden ones included.
  ///
  /// For the seller's owner and staff; customers see offers, never the catalog.
  @GET('/sellers/{sellerId}/dishes')
  Future<ListDishesResponse> listDishes({
    @Path('sellerId') required String sellerId,
  });

  /// Add a dish to a seller's catalog.
  ///
  /// The stable base of a dish. A post copies it; a later change to the dish does not change a post.
  @POST('/sellers/{sellerId}/dishes')
  Future<DishBody> addDish({
    @Path('sellerId') required String sellerId,
    @Body() required DishDetailsBody body,
  });
}
