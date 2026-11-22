// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'analysis_dish_body.freezed.dart';
part 'analysis_dish_body.g.dart';

@Freezed()
abstract class AnalysisDishBody with _$AnalysisDishBody {
  const factory AnalysisDishBody({
    /// Units of them collected
    required int collected,
    required String name,
    required String offerId,

    /// Units posted
    required int posted,
    required String sellerName,
    required String unit,
  }) = _AnalysisDishBody;

  factory AnalysisDishBody.fromJson(Map<String, Object?> json) =>
      _$AnalysisDishBodyFromJson(json);
}
