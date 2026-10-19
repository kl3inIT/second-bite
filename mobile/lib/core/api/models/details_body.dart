// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'details_body.freezed.dart';
part 'details_body.g.dart';

@Freezed()
abstract class DetailsBody with _$DetailsBody {
  const factory DetailsBody({
    /// The address as people write it
    required String address,

    /// Where the seller is, pinned on a map
    required double latitude,
    required double longitude,
    required String name,

    /// Shown to the seller's members and admins
    required String phone,
  }) = _DetailsBody;

  factory DetailsBody.fromJson(Map<String, Object?> json) =>
      _$DetailsBodyFromJson(json);
}
