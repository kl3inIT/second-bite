// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'set_display_name_input_body.freezed.dart';
part 'set_display_name_input_body.g.dart';

@Freezed()
abstract class SetDisplayNameInputBody with _$SetDisplayNameInputBody {
  const factory SetDisplayNameInputBody({
    /// 1 to 50 characters once trimmed; Google never replaces it
    required String displayName,
  }) = _SetDisplayNameInputBody;

  factory SetDisplayNameInputBody.fromJson(Map<String, Object?> json) =>
      _$SetDisplayNameInputBodyFromJson(json);
}
