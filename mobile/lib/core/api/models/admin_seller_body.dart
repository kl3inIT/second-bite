// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'admin_seller_body.freezed.dart';
part 'admin_seller_body.g.dart';

@Freezed()
abstract class AdminSellerBody with _$AdminSellerBody {
  const factory AdminSellerBody({
    /// Absent when the owner deleted their account
    String? ownerEmail,
  }) = _AdminSellerBody;

  factory AdminSellerBody.fromJson(Map<String, Object?> json) =>
      _$AdminSellerBodyFromJson(json);
}
