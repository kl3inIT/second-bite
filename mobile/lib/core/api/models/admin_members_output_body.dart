// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'member_body.dart';

part 'admin_members_output_body.freezed.dart';
part 'admin_members_output_body.g.dart';

@Freezed()
abstract class AdminMembersOutputBody with _$AdminMembersOutputBody {
  const factory AdminMembersOutputBody({required List<MemberBody>? members}) =
      _AdminMembersOutputBody;

  factory AdminMembersOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminMembersOutputBodyFromJson(json);
}
