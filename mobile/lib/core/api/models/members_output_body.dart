// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'member_body.dart';

part 'members_output_body.freezed.dart';
part 'members_output_body.g.dart';

@Freezed()
abstract class MembersOutputBody with _$MembersOutputBody {
  const factory MembersOutputBody({required List<MemberBody>? members}) =
      _MembersOutputBody;

  factory MembersOutputBody.fromJson(Map<String, Object?> json) =>
      _$MembersOutputBodyFromJson(json);
}
