// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'member_body_role.dart';

part 'member_body.freezed.dart';
part 'member_body.g.dart';

@Freezed()
abstract class MemberBody with _$MemberBody {
  const factory MemberBody({
    required String accountId,
    required DateTime addedAt,
    required String email,
    required MemberBodyRole role,
  }) = _MemberBody;

  factory MemberBody.fromJson(Map<String, Object?> json) =>
      _$MemberBodyFromJson(json);
}
