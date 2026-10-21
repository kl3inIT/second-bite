// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'review_body.freezed.dart';
part 'review_body.g.dart';

@Freezed()
abstract class ReviewBody with _$ReviewBody {
  const factory ReviewBody({
    required DateTime createdAt,
    required int stars,
    required List<String> tags,
    String? comment,
  }) = _ReviewBody;

  factory ReviewBody.fromJson(Map<String, Object?> json) =>
      _$ReviewBodyFromJson(json);
}
