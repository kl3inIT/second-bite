// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'delete_seller_request.freezed.dart';
part 'delete_seller_request.g.dart';

@Freezed()
abstract class DeleteSellerRequest with _$DeleteSellerRequest {
  const factory DeleteSellerRequest({
    /// What the owner is told, 10 to 500 characters
    required String reason,
  }) = _DeleteSellerRequest;

  factory DeleteSellerRequest.fromJson(Map<String, Object?> json) =>
      _$DeleteSellerRequestFromJson(json);
}
