// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'offer_settings_body.freezed.dart';
part 'offer_settings_body.g.dart';

@Freezed()
abstract class OfferSettingsBody with _$OfferSettingsBody {
  const factory OfferSettingsBody({
    /// The search radius when a customer names none
    required int defaultRadiusKm,
    required int maxRadiusKm,

    /// How far below its original price an offer must be priced
    required int minDiscountPercent,

    /// How far ahead of posting a window may start
    required int startsWithinHours,

    /// The longest collection window
    required int windowMaxMinutes,

    /// The shortest collection window
    required int windowMinMinutes,
    DateTime? updatedAt,
    String? updatedBy,
  }) = _OfferSettingsBody;

  factory OfferSettingsBody.fromJson(Map<String, Object?> json) =>
      _$OfferSettingsBodyFromJson(json);
}
