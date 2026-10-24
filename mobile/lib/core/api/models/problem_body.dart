// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'problem_body_kind.dart';

part 'problem_body.freezed.dart';
part 'problem_body.g.dart';

@Freezed()
abstract class ProblemBody with _$ProblemBody {
  const factory ProblemBody({
    required ProblemBodyKind kind,
    required DateTime reportedAt,

    /// The store's answer, none until it answers
    String? answer,
    DateTime? answeredAt,
    String? note,
  }) = _ProblemBody;

  factory ProblemBody.fromJson(Map<String, Object?> json) =>
      _$ProblemBodyFromJson(json);
}
