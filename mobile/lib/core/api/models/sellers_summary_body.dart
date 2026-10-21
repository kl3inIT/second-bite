// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'opened_seller_body.dart';
import 'seller_status_day.dart';

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

    /// The sellers in each status at the end of every day of the range, in order. Rebuilt from each seller's status now and when it last changed, so right only when every seller changed status at most once
    required List<SellerStatusDay> perDay,
  }) = _SellersSummaryBody;

  factory SellersSummaryBody.fromJson(Map<String, Object?> json) =>
      _$SellersSummaryBodyFromJson(json);
}
