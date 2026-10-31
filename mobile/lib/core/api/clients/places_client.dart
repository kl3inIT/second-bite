// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/places_output_body.dart';

part 'places_client.g.dart';

@RestApi()
abstract class PlacesClient {
  factory PlacesClient(Dio dio, {String? baseUrl}) = _PlacesClient;

  /// Places in Hanoi for the words a customer typed, to look for dishes around; signed in or not.
  ///
  /// [q] - The words of an address or a place, with or without Vietnamese marks.
  @GET('/places')
  Future<PlacesOutputBody> searchCustomerPlaces({
    @Query('q') required String q,
  });
}
