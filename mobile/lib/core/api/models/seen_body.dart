// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'seen_body.freezed.dart';
part 'seen_body.g.dart';

@Freezed()
abstract class SeenBody with _$SeenBody {
  const factory SeenBody({
    /// The highest message the customer has read
    required int customer,

    /// The highest message the seller's people have read
    required int seller,
  }) = _SeenBody;

  factory SeenBody.fromJson(Map<String, Object?> json) =>
      _$SeenBodyFromJson(json);
}
