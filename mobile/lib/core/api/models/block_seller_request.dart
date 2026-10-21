// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'block_seller_request.freezed.dart';
part 'block_seller_request.g.dart';

@Freezed()
abstract class BlockSellerRequest with _$BlockSellerRequest {
  const factory BlockSellerRequest({
    /// What the owner is told, 10 to 500 characters
    required String reason,
  }) = _BlockSellerRequest;

  factory BlockSellerRequest.fromJson(Map<String, Object?> json) =>
      _$BlockSellerRequestFromJson(json);
}
