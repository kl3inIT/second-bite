// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'collection_point_body.freezed.dart';
part 'collection_point_body.g.dart';

@Freezed()
abstract class CollectionPointBody with _$CollectionPointBody {
  const factory CollectionPointBody({
    required String address,
    required double latitude,
    required double longitude,
  }) = _CollectionPointBody;

  factory CollectionPointBody.fromJson(Map<String, Object?> json) =>
      _$CollectionPointBodyFromJson(json);
}
