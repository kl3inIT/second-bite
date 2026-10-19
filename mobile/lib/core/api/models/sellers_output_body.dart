// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'seller_body.dart';

part 'sellers_output_body.freezed.dart';
part 'sellers_output_body.g.dart';

@Freezed()
abstract class SellersOutputBody with _$SellersOutputBody {
  const factory SellersOutputBody({required List<SellerBody>? sellers}) =
      _SellersOutputBody;

  factory SellersOutputBody.fromJson(Map<String, Object?> json) =>
      _$SellersOutputBodyFromJson(json);
}
