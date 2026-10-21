// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'place_body.dart';

part 'places_output_body.freezed.dart';
part 'places_output_body.g.dart';

@Freezed()
abstract class PlacesOutputBody with _$PlacesOutputBody {
  const factory PlacesOutputBody({
    /// Up to five places in Hanoi; none when nothing matches or the search does not answer
    required List<PlaceBody>? places,
  }) = _PlacesOutputBody;

  factory PlacesOutputBody.fromJson(Map<String, Object?> json) =>
      _$PlacesOutputBodyFromJson(json);
}
