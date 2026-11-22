// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'analysis_count_body.dart';
import 'analysis_discount_body.dart';
import 'analysis_dish_body.dart';
import 'analysis_kind_body.dart';
import 'analysis_slot_body.dart';
import 'lead_times_struct.dart';
import 'sell_out_struct.dart';

part 'analysis_output_body.freezed.dart';
part 'analysis_output_body.g.dart';

@Freezed()
abstract class AnalysisOutputBody with _$AnalysisOutputBody {
  const factory AnalysisOutputBody({
    /// The same by discount band, from food given away to the smallest discount
    required List<AnalysisDiscountBody> discounts,

    /// The orders not collected by ending: cancelled, expired, or refused_ and the reason; the most first
    required List<AnalysisCountBody> failures,

    /// The portions posted and collected by kind of dish, the most posted first
    required List<AnalysisKindBody> kinds,

    /// How long before the window opened the orders were placed
    required LeadTimesStruct leadTimes,

    /// The orders reported for each kind of problem
    required List<AnalysisCountBody> problems,

    /// How long the posts took from posting to their last unit ordered
    required SellOutStruct sellOut,
    required DateTime since,

    /// The orders by weekday and hour of their window's start
    required List<AnalysisSlotBody> slots,

    /// The views by utm_source, empty for none; the site's whatever store is chosen
    required List<AnalysisCountBody> sources,

    /// The reviews praising each tag
    required List<AnalysisCountBody> tags,

    /// The five ended dishes with the most portions not collected
    required List<AnalysisDishBody> topLeftover,

    /// The five dishes most collected
    required List<AnalysisDishBody> topSold,
    required DateTime until,

    /// The customers by orders handed over: 1, 2, and 3 for three or more
    required List<AnalysisCountBody> visits,
  }) = _AnalysisOutputBody;

  factory AnalysisOutputBody.fromJson(Map<String, Object?> json) =>
      _$AnalysisOutputBodyFromJson(json);
}
