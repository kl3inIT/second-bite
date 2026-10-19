// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'dart:io';

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/file.dart';
import '../models/photo_body.dart';

part 'photos_client.g.dart';

@RestApi()
abstract class PhotosClient {
  factory PhotosClient(Dio dio, {String? baseUrl}) = _PhotosClient;

  /// Upload a photo for an offer or a seller.
  ///
  /// The body is the image itself: JPEG, PNG or WebP, at most 10 MB. It is written again as JPEG in two sizes, without its metadata. An unused photo is kept for a day.
  @POST('/photos')
  Future<PhotoBody> uploadPhoto({@Body() required File body});

  /// A photo in one of its sizes
  @GET('/photos/{photoId}/{file}')
  Future<void> getPhoto({
    @Path('photoId') required String photoId,
    @Path('file') required File file,
  });
}
