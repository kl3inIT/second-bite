// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'seller_body_my_role.dart';
import 'seller_body_status.dart';

part 'seller_body.freezed.dart';
part 'seller_body.g.dart';

@Freezed()
abstract class SellerBody with _$SellerBody {
  const factory SellerBody({
    required String address,
    required DateTime createdAt,
    required String id,
    required double latitude,
    required double longitude,
    required String name,
    required String phone,
    required SellerBodyStatus status,
    required DateTime updatedAt,

    /// The caller's role; absent for an admin who is not a member
    SellerBodyMyRole? myRole,

    /// Served at /photos/{photoId}/1600.jpg and /400.jpg
    String? photoId,
    DateTime? statusChangedAt,
  }) = _SellerBody;

  factory SellerBody.fromJson(Map<String, Object?> json) =>
      _$SellerBodyFromJson(json);
}
