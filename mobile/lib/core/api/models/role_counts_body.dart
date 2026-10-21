// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

part 'role_counts_body.freezed.dart';
part 'role_counts_body.g.dart';

@Freezed()
abstract class RoleCountsBody with _$RoleCountsBody {
  const factory RoleCountsBody({required int admin, required int customer}) =
      _RoleCountsBody;

  factory RoleCountsBody.fromJson(Map<String, Object?> json) =>
      _$RoleCountsBodyFromJson(json);
}
