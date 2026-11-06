// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'phone_history_body.freezed.dart';
part 'phone_history_body.g.dart';

@Freezed()
abstract class PhoneHistoryBody with _$PhoneHistoryBody {
  const factory PhoneHistoryBody({
    /// Orders it missed at any seller in the order settings' missedDays: no hand-over by the window's end, or refused as no answer, no show, late or suspected
    required int missed,

    /// Orders the phone number holds at this seller still to collect, this one included
    required int open,
  }) = _PhoneHistoryBody;

  factory PhoneHistoryBody.fromJson(Map<String, Object?> json) =>
      _$PhoneHistoryBodyFromJson(json);
}
