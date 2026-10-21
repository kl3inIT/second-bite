// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'reject_seller_request.freezed.dart';
part 'reject_seller_request.g.dart';

@Freezed()
abstract class RejectSellerRequest with _$RejectSellerRequest {
  const factory RejectSellerRequest({
    /// What the owner is told, 10 to 500 characters
    required String reason,
  }) = _RejectSellerRequest;

  factory RejectSellerRequest.fromJson(Map<String, Object?> json) =>
      _$RejectSellerRequestFromJson(json);
}
