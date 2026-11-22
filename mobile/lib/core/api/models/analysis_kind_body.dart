// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'analysis_kind_body_kind.dart';

part 'analysis_kind_body.freezed.dart';
part 'analysis_kind_body.g.dart';

@Freezed()
abstract class AnalysisKindBody with _$AnalysisKindBody {
  const factory AnalysisKindBody({
    /// Units of them collected
    required int collected,
    required AnalysisKindBodyKind kind,

    /// Units posted
    required int posted,
  }) = _AnalysisKindBody;

  factory AnalysisKindBody.fromJson(Map<String, Object?> json) =>
      _$AnalysisKindBodyFromJson(json);
}
