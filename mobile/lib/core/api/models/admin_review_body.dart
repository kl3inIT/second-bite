// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'admin_review_body.freezed.dart';
part 'admin_review_body.g.dart';

@Freezed()
abstract class AdminReviewBody with _$AdminReviewBody {
  const factory AdminReviewBody({
    /// When the customer rated the order
    required DateTime createdAt,

    /// Who collected, as given with the order
    required String customerName,

    /// The order reviewed, which names its review
    required String orderId,

    /// SB- and a number
    required String orderNumber,
    required String sellerId,
    required String sellerName,
    required int stars,
    required List<String> tags,
    String? comment,

    /// When an admin hid it; absent while it shows
    DateTime? hiddenAt,

    /// Why an admin hid it, when they said
    String? hiddenReason,
  }) = _AdminReviewBody;

  factory AdminReviewBody.fromJson(Map<String, Object?> json) =>
      _$AdminReviewBodyFromJson(json);
}
