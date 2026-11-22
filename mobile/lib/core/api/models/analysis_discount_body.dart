// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'analysis_discount_body_band.dart';

part 'analysis_discount_body.freezed.dart';
part 'analysis_discount_body.g.dart';

@Freezed()
abstract class AnalysisDiscountBody with _$AnalysisDiscountBody {
  const factory AnalysisDiscountBody({
    /// The discount against the original price
    required AnalysisDiscountBodyBand band,

    /// Units of them collected
    required int collected,

    /// Units posted
    required int posted,
  }) = _AnalysisDiscountBody;

  factory AnalysisDiscountBody.fromJson(Map<String, Object?> json) =>
      _$AnalysisDiscountBodyFromJson(json);
}
