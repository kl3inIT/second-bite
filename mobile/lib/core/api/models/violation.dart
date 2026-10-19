// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'violation.freezed.dart';
part 'violation.g.dart';

@Freezed()
abstract class Violation with _$Violation {
  const factory Violation({
    required String code,
    required String detail,

    /// The invalid parameter, for example query.limit
    String? parameter,

    /// JSON Pointer to the body member, for example #/priceVnd
    String? pointer,
  }) = _Violation;

  factory Violation.fromJson(Map<String, Object?> json) =>
      _$ViolationFromJson(json);
}
