// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'seller_review_body.freezed.dart';
part 'seller_review_body.g.dart';

@Freezed()
abstract class SellerReviewBody with _$SellerReviewBody {
  const factory SellerReviewBody({
    /// When the customer rated the order
    required DateTime createdAt,

    /// Who collected, as given with the order
    required String customerName,

    /// The order reviewed, which names its review
    required String orderId,

    /// SB- and a number
    required String orderNumber,
    required int stars,
    required List<String> tags,
    String? comment,

    /// The names of the order's dishes, joined by commas
    String? dishes,
  }) = _SellerReviewBody;

  factory SellerReviewBody.fromJson(Map<String, Object?> json) =>
      _$SellerReviewBodyFromJson(json);
}
