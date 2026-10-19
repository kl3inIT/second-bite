// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'offer_body.dart';

part 'offers_output_body.freezed.dart';
part 'offers_output_body.g.dart';

@Freezed()
abstract class OffersOutputBody with _$OffersOutputBody {
  const factory OffersOutputBody({required List<OfferBody> offers}) =
      _OffersOutputBody;

  factory OffersOutputBody.fromJson(Map<String, Object?> json) =>
      _$OffersOutputBodyFromJson(json);
}
