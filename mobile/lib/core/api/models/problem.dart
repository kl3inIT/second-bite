// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'violation.dart';

part 'problem.freezed.dart';
part 'problem.g.dart';

@Freezed()
abstract class Problem with _$Problem {
  const factory Problem({
    /// Stable machine-readable reason
    required String code,
    required int status,
    required String title,

    /// urn:secondbite:failure:<code in kebab case>
    required String type,
    String? detail,

    /// One entry per invalid member or parameter
    List<Violation>? errors,

    /// The identifier returned in X-Request-Id
    String? requestId,
  }) = _Problem;

  factory Problem.fromJson(Map<String, Object?> json) =>
      _$ProblemFromJson(json);
}
