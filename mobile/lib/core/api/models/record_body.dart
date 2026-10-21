// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'record_body_last_sign_in_method.dart';

part 'record_body.freezed.dart';
part 'record_body.g.dart';

@Freezed()
abstract class RecordBody with _$RecordBody {
  const factory RecordBody({
    required DateTime createdAt,

    /// How it last signed in: an emailed code or Google
    RecordBodyLastSignInMethod? lastSignInMethod,

    /// Absent until it signs in
    DateTime? lastSignedInAt,
  }) = _RecordBody;

  factory RecordBody.fromJson(Map<String, Object?> json) =>
      _$RecordBodyFromJson(json);
}
