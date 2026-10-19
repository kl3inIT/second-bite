// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'seller_photo_body.freezed.dart';
part 'seller_photo_body.g.dart';

@Freezed()
abstract class SellerPhotoBody with _$SellerPhotoBody {
  const factory SellerPhotoBody({
    required String id,
    required String largePath,
    required String smallPath,
  }) = _SellerPhotoBody;

  factory SellerPhotoBody.fromJson(Map<String, Object?> json) =>
      _$SellerPhotoBodyFromJson(json);
}
