// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'set_seller_photo_request.freezed.dart';
part 'set_seller_photo_request.g.dart';

@Freezed()
abstract class SetSellerPhotoRequest with _$SetSellerPhotoRequest {
  const factory SetSellerPhotoRequest({
    /// From POST /photos
    required String photoId,
  }) = _SetSellerPhotoRequest;

  factory SetSellerPhotoRequest.fromJson(Map<String, Object?> json) =>
      _$SetSellerPhotoRequestFromJson(json);
}
