// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'google_method_body.dart';

part 'methods_output_body.freezed.dart';
part 'methods_output_body.g.dart';

@Freezed()
abstract class MethodsOutputBody with _$MethodsOutputBody {
  const factory MethodsOutputBody({
    /// Present when signing in with Google is available
    GoogleMethodBody? google,
  }) = _MethodsOutputBody;

  factory MethodsOutputBody.fromJson(Map<String, Object?> json) =>
      _$MethodsOutputBodyFromJson(json);
}
