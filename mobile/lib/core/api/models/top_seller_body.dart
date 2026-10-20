// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'top_seller_body.freezed.dart';
part 'top_seller_body.g.dart';

@Freezed()
abstract class TopSellerBody with _$TopSellerBody {
  const factory TopSellerBody({
    /// As the seller's newest offer in the range copied it
    required String name,

    /// Offers it posted in the range
    required int offers,
    required String sellerId,
  }) = _TopSellerBody;

  factory TopSellerBody.fromJson(Map<String, Object?> json) =>
      _$TopSellerBodyFromJson(json);
}
