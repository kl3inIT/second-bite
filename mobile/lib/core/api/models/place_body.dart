// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'place_body.freezed.dart';
part 'place_body.g.dart';

@Freezed()
abstract class PlaceBody with _$PlaceBody {
  const factory PlaceBody({
    /// As people write it; a house number typed first goes before a street that has none
    required String address,
    required double latitude,
    required double longitude,
  }) = _PlaceBody;

  factory PlaceBody.fromJson(Map<String, Object?> json) =>
      _$PlaceBodyFromJson(json);
}
