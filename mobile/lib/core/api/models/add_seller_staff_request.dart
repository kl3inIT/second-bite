// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'add_seller_staff_request.freezed.dart';
part 'add_seller_staff_request.g.dart';

@Freezed()
abstract class AddSellerStaffRequest with _$AddSellerStaffRequest {
  const factory AddSellerStaffRequest({required String email}) =
      _AddSellerStaffRequest;

  factory AddSellerStaffRequest.fromJson(Map<String, Object?> json) =>
      _$AddSellerStaffRequestFromJson(json);
}
