// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'seller_profile_body.dart';

part 'followed_output_body.freezed.dart';
part 'followed_output_body.g.dart';

@Freezed()
abstract class FollowedOutputBody with _$FollowedOutputBody {
  const factory FollowedOutputBody({
    required List<SellerProfileBody>? sellers,
  }) = _FollowedOutputBody;

  factory FollowedOutputBody.fromJson(Map<String, Object?> json) =>
      _$FollowedOutputBodyFromJson(json);
}
