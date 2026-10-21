// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_line_photo_body.dart';

part 'order_line_body.freezed.dart';
part 'order_line_body.g.dart';

@Freezed()
abstract class OrderLineBody with _$OrderLineBody {
  const factory OrderLineBody({
    required String name,
    required String offerId,
    required int originalPriceVnd,
    required OrderLinePhotoBody photo,
    required int priceVnd,
    required String unit,
    required int units,
  }) = _OrderLineBody;

  factory OrderLineBody.fromJson(Map<String, Object?> json) =>
      _$OrderLineBodyFromJson(json);
}
