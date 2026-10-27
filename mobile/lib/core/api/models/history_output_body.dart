// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'order_body.dart';

part 'history_output_body.freezed.dart';
part 'history_output_body.g.dart';

@Freezed()
abstract class HistoryOutputBody with _$HistoryOutputBody {
  const factory HistoryOutputBody({
    /// Orders handed over
    required int collected,

    /// Orders the customer did not come for: the window ended, or staff ended them as no answer, no show or late
    required int missed,
    required int placed,

    /// The latest five, newest first
    required List<OrderBody> recent,
  }) = _HistoryOutputBody;

  factory HistoryOutputBody.fromJson(Map<String, Object?> json) =>
      _$HistoryOutputBodyFromJson(json);
}
