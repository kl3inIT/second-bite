// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/list_running_promotions_response.dart';

part 'promotions_client.g.dart';

@RestApi()
abstract class PromotionsClient {
  factory PromotionsClient(Dio dio, {String? baseUrl}) = _PromotionsClient;

  /// The promotions running now for any of some sellers, soonest to end first.
  ///
  /// What a cart may take off, signed in or not. What one phone number gets is never told before the order is placed; the order says the discount it took.
  ///
  /// [sellerId] - The sellers of the cart.
  @GET('/promotions/running')
  Future<ListRunningPromotionsResponse> listRunningPromotions({
    @Query('sellerId') List<String>? sellerId,
  });
}
