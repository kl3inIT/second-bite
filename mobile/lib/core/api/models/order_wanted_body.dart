// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_wanted_body.freezed.dart';
part 'order_wanted_body.g.dart';

@Freezed()
abstract class OrderWantedBody with _$OrderWantedBody {
  const factory OrderWantedBody({required String offerId, required int units}) =
      _OrderWantedBody;

  factory OrderWantedBody.fromJson(Map<String, Object?> json) =>
      _$OrderWantedBodyFromJson(json);
}
