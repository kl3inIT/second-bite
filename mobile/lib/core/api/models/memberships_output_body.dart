// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'membership_body.dart';

part 'memberships_output_body.freezed.dart';
part 'memberships_output_body.g.dart';

@Freezed()
abstract class MembershipsOutputBody with _$MembershipsOutputBody {
  const factory MembershipsOutputBody({
    required List<MembershipBody>? memberships,
  }) = _MembershipsOutputBody;

  factory MembershipsOutputBody.fromJson(Map<String, Object?> json) =>
      _$MembershipsOutputBodyFromJson(json);
}
