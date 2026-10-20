// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'opened_seller_body.freezed.dart';
part 'opened_seller_body.g.dart';

@Freezed()
abstract class OpenedSellerBody with _$OpenedSellerBody {
  const factory OpenedSellerBody({
    required String id,
    required String name,
    required DateTime openedAt,
  }) = _OpenedSellerBody;

  factory OpenedSellerBody.fromJson(Map<String, Object?> json) =>
      _$OpenedSellerBodyFromJson(json);
}
