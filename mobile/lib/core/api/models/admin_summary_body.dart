// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'accounts_summary_body.dart';
import 'offers_summary_body.dart';
import 'sellers_summary_body.dart';

part 'admin_summary_body.freezed.dart';
part 'admin_summary_body.g.dart';

@Freezed()
abstract class AdminSummaryBody with _$AdminSummaryBody {
  const factory AdminSummaryBody({
    required AccountsSummaryBody accounts,

    /// The range's first day in Vietnam time
    required DateTime from,
    required OffersSummaryBody offers,
    required SellersSummaryBody sellers,

    /// The range's last day in Vietnam time, included
    required DateTime to,
  }) = _AdminSummaryBody;

  factory AdminSummaryBody.fromJson(Map<String, Object?> json) =>
      _$AdminSummaryBodyFromJson(json);
}
