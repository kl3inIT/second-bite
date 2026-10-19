// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'photo_body.freezed.dart';
part 'photo_body.g.dart';

@Freezed()
abstract class PhotoBody with _$PhotoBody {
  const factory PhotoBody({
    required int height,
    required String id,

    /// The photo at most 1600 px on its longer side
    required String largePath,

    /// The photo at most 400 px on its longer side, for lists
    required String smallPath,

    /// Of the photo as uploaded, turned the way it was taken
    required int width,
  }) = _PhotoBody;

  factory PhotoBody.fromJson(Map<String, Object?> json) =>
      _$PhotoBodyFromJson(json);
}
