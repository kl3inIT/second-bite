// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'membership_body_role.dart';
import 'membership_body_seller_status.dart';

part 'membership_body.freezed.dart';
part 'membership_body.g.dart';

@Freezed()
abstract class MembershipBody with _$MembershipBody {
  const factory MembershipBody({
    required String accountId,
    required MembershipBodyRole role,
    required String sellerId,
    required String sellerName,
    required MembershipBodySellerStatus sellerStatus,
  }) = _MembershipBody;

  factory MembershipBody.fromJson(Map<String, Object?> json) =>
      _$MembershipBodyFromJson(json);
}
