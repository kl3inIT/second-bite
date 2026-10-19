// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'seller_photo_body.dart';

part 'seller_profile_body.freezed.dart';
part 'seller_profile_body.g.dart';

@Freezed()
abstract class SellerProfileBody with _$SellerProfileBody {
  const factory SellerProfileBody({
    required String address,
    required String id,
    required double latitude,
    required double longitude,
    required String name,
    SellerPhotoBody? photo,
  }) = _SellerProfileBody;

  factory SellerProfileBody.fromJson(Map<String, Object?> json) =>
      _$SellerProfileBodyFromJson(json);
}
