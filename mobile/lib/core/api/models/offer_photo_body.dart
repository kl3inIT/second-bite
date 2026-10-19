// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'offer_photo_body.freezed.dart';
part 'offer_photo_body.g.dart';

@Freezed()
abstract class OfferPhotoBody with _$OfferPhotoBody {
  const factory OfferPhotoBody({
    required String id,
    required String largePath,
    required String smallPath,
  }) = _OfferPhotoBody;

  factory OfferPhotoBody.fromJson(Map<String, Object?> json) =>
      _$OfferPhotoBodyFromJson(json);
}
