// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:freezed_annotation/freezed_annotation.dart';

import 'record_body.dart';
import 'role_counts_body.dart';

part 'admin_accounts_output_body.freezed.dart';
part 'admin_accounts_output_body.g.dart';

@Freezed()
abstract class AdminAccountsOutputBody with _$AdminAccountsOutputBody {
  const factory AdminAccountsOutputBody({
    /// How many accounts of each role match the words, whatever the role asked
    required RoleCountsBody counts,
    required List<RecordBody>? items,
    required int page,
    required int pageSize,

    /// How many accounts match the role and the words
    required int total,
  }) = _AdminAccountsOutputBody;

  factory AdminAccountsOutputBody.fromJson(Map<String, Object?> json) =>
      _$AdminAccountsOutputBodyFromJson(json);
}
