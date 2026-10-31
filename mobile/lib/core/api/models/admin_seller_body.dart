// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'admin_seller_body_status.dart';

part 'admin_seller_body.freezed.dart';
part 'admin_seller_body.g.dart';

@Freezed()
abstract class AdminSellerBody with _$AdminSellerBody {
  const factory AdminSellerBody({
    required String address,
    required DateTime createdAt,
    required String id,
    required double latitude,
    required double longitude,
    required String name,
    required String phone,
    required AdminSellerBodyStatus status,
    required DateTime updatedAt,

    /// When an admin deleted the seller, blocked, which waits for its orders still to finish; absent when it does not wait
    DateTime? deletionRequestedAt,

    /// Absent when the owner deleted their account
    String? ownerEmail,

    /// Served at /photos/{photoId}/1600.jpg and /400.jpg
    String? photoId,
    DateTime? statusChangedAt,

    /// Why an admin rejected or blocked the seller, as the owner is told
    String? statusReason,
  }) = _AdminSellerBody;

  factory AdminSellerBody.fromJson(Map<String, Object?> json) =>
      _$AdminSellerBodyFromJson(json);
}
