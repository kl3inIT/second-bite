// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'change_seller_owner_request.freezed.dart';
part 'change_seller_owner_request.g.dart';

@Freezed()
abstract class ChangeSellerOwnerRequest with _$ChangeSellerOwnerRequest {
  const factory ChangeSellerOwnerRequest({
    /// The new owner's address
    required String email,
  }) = _ChangeSellerOwnerRequest;

  factory ChangeSellerOwnerRequest.fromJson(Map<String, Object?> json) =>
      _$ChangeSellerOwnerRequestFromJson(json);
}
