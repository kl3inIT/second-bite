// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'unsubscribe_push_input_body.freezed.dart';
part 'unsubscribe_push_input_body.g.dart';

@Freezed()
abstract class UnsubscribePushInputBody with _$UnsubscribePushInputBody {
  const factory UnsubscribePushInputBody({required String endpoint}) =
      _UnsubscribePushInputBody;

  factory UnsubscribePushInputBody.fromJson(Map<String, Object?> json) =>
      _$UnsubscribePushInputBodyFromJson(json);
}
