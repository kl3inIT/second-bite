// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'order_settings_body.freezed.dart';
part 'order_settings_body.g.dart';

@Freezed()
abstract class OrderSettingsBody with _$OrderSettingsBody {
  const factory OrderSettingsBody({
    /// The days missed orders are counted over; the block lifts as they pass
    required int missedDays,

    /// Orders missed within missedDays that stop a phone number ordering
    required int missedLimit,

    /// Orders still to collect that may have been placed from one address; loose, as a mall's Wi-Fi is shared
    required int openPerAddress,

    /// Orders still to collect one phone number may hold at a store
    required int openPerPhonePerSeller,
    DateTime? updatedAt,
    String? updatedBy,
  }) = _OrderSettingsBody;

  factory OrderSettingsBody.fromJson(Map<String, Object?> json) =>
      _$OrderSettingsBodyFromJson(json);
}
