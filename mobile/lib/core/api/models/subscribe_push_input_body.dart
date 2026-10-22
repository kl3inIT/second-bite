// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'push_keys.dart';

part 'subscribe_push_input_body.freezed.dart';
part 'subscribe_push_input_body.g.dart';

@Freezed()
abstract class SubscribePushInputBody with _$SubscribePushInputBody {
  const factory SubscribePushInputBody({
    /// The push service's address for this browser
    required String endpoint,
    required PushKeys keys,

    /// Live tickets, one per topic to follow: an order's (POST /orders/{id}/live-ticket) or a seller's
    required List<String>? tickets,
  }) = _SubscribePushInputBody;

  factory SubscribePushInputBody.fromJson(Map<String, Object?> json) =>
      _$SubscribePushInputBodyFromJson(json);
}
