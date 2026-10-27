// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'record_body.dart';

part 'admins_output_body.freezed.dart';
part 'admins_output_body.g.dart';

@Freezed()
abstract class AdminsOutputBody with _$AdminsOutputBody {
  const factory AdminsOutputBody({
    /// Every admin, by address
    required List<RecordBody>? admins,
  }) = _AdminsOutputBody;

  factory AdminsOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminsOutputBodyFromJson(json);
}
