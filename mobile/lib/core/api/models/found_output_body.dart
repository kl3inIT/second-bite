// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'found_body.dart';

part 'found_output_body.freezed.dart';
part 'found_output_body.g.dart';

@Freezed()
abstract class FoundOutputBody with _$FoundOutputBody {
  const factory FoundOutputBody({required List<FoundBody> offers}) =
      _FoundOutputBody;

  factory FoundOutputBody.fromJson(Map<String, Object?> json) =>
      _$FoundOutputBodyFromJson(json);
}
