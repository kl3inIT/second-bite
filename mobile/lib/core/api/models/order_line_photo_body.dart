// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_line_photo_body.freezed.dart';
part 'order_line_photo_body.g.dart';

@Freezed()
abstract class OrderLinePhotoBody with _$OrderLinePhotoBody {
  const factory OrderLinePhotoBody({
    required String id,
    required String largePath,
    required String smallPath,
  }) = _OrderLinePhotoBody;

  factory OrderLinePhotoBody.fromJson(Map<String, Object?> json) =>
      _$OrderLinePhotoBodyFromJson(json);
}
