// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'view_input_body.freezed.dart';
part 'view_input_body.g.dart';

@Freezed()
abstract class ViewInputBody with _$ViewInputBody {
  const factory ViewInputBody({
    /// The page's path, as the address bar shows it, such as /vi/sellers/{id}
    required String path,

    /// utm_source of the address that opened the site, such as qr; anything else than 1 to 40 of a-z, 0-9, _ and - counts as none
    String? source,
  }) = _ViewInputBody;

  factory ViewInputBody.fromJson(Map<String, Object?> json) =>
      _$ViewInputBodyFromJson(json);
}
