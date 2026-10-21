// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'opened_seller_body.dart';

part 'sellers_summary_body.freezed.dart';
part 'sellers_summary_body.g.dart';

@Freezed()
abstract class SellersSummaryBody with _$SellersSummaryBody {
  const factory SellersSummaryBody({
    /// Sellers active now
    required int active,

    /// Sellers blocked now
    required int blocked,

    /// The five sellers opened last, newest first, whenever that was
    required List<OpenedSellerBody> latest,

    /// Sellers opened in the range, whatever their status
    required int openedInRange,

    /// Sellers pending now
    required int pending,

    /// Sellers rejected now
    required int rejected,
  }) = _SellersSummaryBody;

  factory SellersSummaryBody.fromJson(Map<String, Object?> json) =>
      _$SellersSummaryBodyFromJson(json);
}
